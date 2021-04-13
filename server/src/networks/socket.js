const WebSocket = require('ws');
const Logger = require('../commons/logger');
const Player = require('../players/player');
const Emitter = require('./emitter');
const Reader = require('./reader');
const Receiver = require('./receiver');

class Socket {
    constructor(gamecore) {
        this._gamecore = gamecore;
        this._ws = null;
        this._counter = 0;
    }

    create() {
        Logger.info("Create Socket");
        Logger.info("Waiting Player...");
        Logger.info("Server Port: 3000");

        const wsOptions = {
            port: "3000",
            perMessageDeflate: false,
            maxPayload: 4096
        };
        this._ws = new WebSocket.Server(wsOptions);
        this._ws.on("connection", this.onConnection.bind(this));
        this._ws.on("error", this.onError.bind(this));
    }

    update() {
    }

    /**
     * クライアント接続
     * @param {*} ws 
     */
    onConnection(ws) {
        Logger.info(`Joined Player IP: ${ws._socket.remoteAddress}:${ws._socket.remotePort}`);
        ws.player = new Player(ws, this.counter);
        ws.receiver = new Receiver(ws);
        ws.emitter = new Emitter(ws);
        ws.emitter.create();

        // 初期送信
        this.initializeEmit(ws);

        // メッセージ処理
        ws.on("message", (msg) => {
            this.onMessage(msg, ws);
        });

        // ソケット閉め処理
        ws.on("close", (event) => {
            this.onClose(event, ws);
        })

        // マッチング処理
        this._gamecore.matching.joinPlayer(ws.player);
    }

    /**
     * エラー処理
     * @param {*} ws 
     */
    onError(ws) {

    }

    /**
     * クライアントからのメッセージ処理
     * @param {*} msg 
     * @param {*} ws 
     */
    onMessage(msg, ws) {
        const reader = new Reader(Buffer.from(msg));
        ws.receiver.handle(reader);
    }

    /**
     * クライアントが接続を閉じたとき
     * @param {*} event 
     * @param {*} ws 
     */
    onClose(event, ws) {
        ws.player.destroy();
        this._gamecore.matching.leavePlayer(ws.player);
        ws.removeAllListeners();
    }

    /**
     * 初期送信処理
     * @param {*} ws 
     */
    initializeEmit(ws) {
        ws.emitter.setPlayerId();
        ws.emitter.updatePlayer();
        ws.emitter.updateCell();
    }

    /**
     * WSの取得
     */
    get ws() {
        return this._ws;
    }

    /**
     * GameCoreの取得
     */
    get gameCore() {
        return this._gamecore;
    }
    
    /**
     * 新しい番号の付与
     * @returns 
     */
    get counter() {
        if (this._counter > 2147483647) {
            this._counter = 1;
        }
        return this._counter += 1;
    }
}

module.exports = Socket;