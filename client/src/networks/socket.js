import { Cell } from "../entities/cell";
import { Player } from "../players/player";

export class Socket {
    constructor(gamecore) {
        this.gamecore = gamecore;
    }

    /**
     * ソケットの生成
     */
    create() {
        this.ws = new WebSocket("ws://localhost:3000");
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);
    }

    /**
     * サーバに接続した時
     * @param {*} ws 
     */
    onOpen(ws) {
        console.log("Socket Open");
    }

    /**
     * サーバからのメッセージ取得
     * @param {*} message 
     */
    onMessage(message) {
        const reader = new Reader(new DataView(message.data), 0, true);
        const type = reader.getUint8();
        switch (type) {
            case 0: // クライアントのID
                this.setId(reader);
                break;
            case 10: // Playerの追加、更新、削除
                this.addPlayer(reader);
                this.updatePlayer(reader);
                this.deletePlayer(reader);
                break;
            case 11: // Cellの追加、更新、削除
                this.addCell(reader);
                this.updateCell(reader);
                this.deleteCell(reader);
                break;
            case 12: // チームメンバーの更新
                this.updateTeamMember(reader);
                break;
            case 20: // 運営からのメッセージ
                this.serverMessage(reader);
                break;
            case 21: // 通常メッセージ
                this.chatMessage(reader);
                break;
        }
    }

    /**
     * ソケットが閉じたとき
     * @param {*} ws 
     */
    onClose(ws) {
        console.log("Socket Close");
    }

    /**
     * ソケットのエラー処理
     * @param {*} ws 
     */
    onError(ws) {
        console.log("Socket Error");
    }

    // -----------------------------------------------------------------------------
    /**
     * クライアントのIDの設定
     * @param {*} reader 
     */
    setId(reader) {
        let id = reader.getUint32();
        this.gamecore.playerId = id;
    }

    /**
     * 参加している、参加するプレイヤーの取得と設定
     * @param {*} reader 
     */
    addPlayer(reader) {
        const playerCount = reader.getUint16();
        for (let i = 0; i < playerCount; i++) {
            const id = reader.getUint32();
            const team = reader.getStringEX();
            const name = reader.getStringEX();
            const player = new Player(this.gamecore, id, team, name);
            this.gamecore.allPlayers.setData(id, player);
        }
    }

    /**
     * プレイヤーの更新
     * @param {*} reader 
     */
    updatePlayer(reader) {
        const playerCount = reader.getUint16();
        for (let i = 0; i < playerCount; i++) {
            const id = reader.getUint32();
            const player = this.gamecore.allPlayers.getData();
            player.setTeam(reader.getStringEX());
            player.setName(reader.getStringEX());
            this.gamecore.allPlayers.setData(id, player);
        }
    }

    /**
     * プレイヤーの削除
     * @param {*} reader 
     */
    deletePlayer(reader) {
        const count = reader.getUint16();
        for (let i = 0; i < count; i++) {
            const id = reader.getUint32();
            this.gamecore.allPlayers.erase(id);
        }
    }

    /**
     * セルの追加
     * @param {*} reader 
     */
    addCell(reader) {
        const cellCount = reader.getUint16();
        
        // Cell
        for (let i = 0; i < cellCount; i++) {
            const cellId = reader.getUint32();
            const cellType = reader.getUint8();
            const x = reader.getFloat32();
            const y = reader.getFloat32();
            const size = reader.getUint16();

            // PlayerCellならば
            if (cellType == 3) {
                const playerid = reader.getUint16();
                const player = this.gamecore.allPlayers.getData(playerid);
                player.addCell(cellId, cellType, x, y, size);
                this.gamecore.allPlayers.setData(id, player);
            } else {
                const cell = new Cell(null, cellId, cellType, x, y, size, "yellow");
                this.gamecore.viewCells.push(cell);
            }
        }
    }

    /**
     * セルの更新
     * @param {*} reader 
     */
    updateCell(reader) {
        const playerid = reader.getUint16();
        const cellCount = reader.getUint16();
        
        for (let i = 0; i < cellCount; i++) {
            const cellId = reader.getUint32();
            const cellType = reader.getUint8();
            const x = reader.getFloat32();
            const y = reader.getFloat32();
            const size = reader.getUint16();

            if (cellType == 3) {
                const player = this.gamecore.allPlayers.getData(playerid);
                player.updateCell(cellId, x, y, size);
                this.gamecore.allPlayers.setData(id, player);
            } else {
                const cell = this.gamecore.viewCells.find(element => element.id == cellId);
                cell.update(x, y, size);
            }
        }
    }

    /**
     * セルの削除
     * @param {*} reader 
     */
    deleteCell(reader) {
        const playerid = reader.getUint16();
        const cellCount = reader.getUint16();
        
        for (let i = 0; i < cellCount; i++) {
            const cellId = reader.getUint32();
            const cellType = reader.getUint8();

            if (cellType == 3) {
                const player = this.gamecore.allPlayers.getData(playerid);
                player.deleteCell(cellId);
                this.gamecore.allPlayers.setData(cellId, player);
            } else {
                const index = this.gamecore.viewCells.findIndex(element => element.id == cellId);
                this.gamecore.viewCells.splice(index, 1);
            }
        }
    }

    /**
     * チームメンバーの更新
     * @param {*} reader 
     */
    updateTeamMember(reader) {
        const playerid = reader.getUint16();
        const playerCount = reader.getUint16();
        
        const player = this.gamecore.allPlayers.getData(playerid);
        for (let i = 0; i < playerCount; i++) {
            const mapx = reader.getFloat32();
            const mapy = reader.getFloat32();
            const mx = reader.getFloat32();
            const my = reader.getFloat32();
            player.setMousePosition(x, y);
        }
    }

    /**
     * サーバからのメッセージ
     * @param {*} reader 
     */
    serverMessage(reader) {
        
    }

    /**
     * 通常メッセージ
     * @param {*} reader 
     */
    chatMessage(reader) {

    }
}