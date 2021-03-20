const UserAccount = require("../commons/account");
const { Box } = require('js-quadtree');
const Vector2 = require("../commons/vector");
const Cells = require("./cells");
const Logger = require("../commons/logger");

class Player {
    constructor(ws, id) {
        this.ws = ws;
        this.isConnected = false;
        this.isJoined = false;
        this.account = new UserAccount();
        this.ipAddress = ws._socket.remoteAddress;
        this.room = null;

        this.id = id;
        this.team = "";
        this.name = "";
        this.ability = null;
        this.tabActive = 0;
        this.cellsArray = [];
        this.zoomRange = 1.0;

        // Camera
        this.position = new Vector2(0, 0);
        this.oldViewNodes = [];
        this.newViewNodes = [];

        if (!this.isConnected) {
            this.isConnected = true;
        }
    }

    destroy() {
        this.isConnected = false;
        this.oldViewNodes.length = 0;
        this.newViewNodes.length = 0;
        this.cellsArray.length = 0;
        if (this.room) {
            delete this.room;
            this.room = null;
        }
        if (this.ability) {
            delete this.ability;
            this.ability = null;
        }
    }

    /**
     * 更新処理
     */
    update() {
        if (this.room != null) {
            if (!this.isConnected || !this.isJoined) {
    
            } else {
                this.updateCells();
            }
    
            this.updateViewNodes();
        }
    }

    /**
     * 細胞の更新処理
     */
    updateCells() {
        this.cellsArray.forEach(cells => {
            cells.update();
        });
    }

    /**
     * カメラに映っている細胞を取り出します
     */
    updateViewNodes() {
        if (this.cellsArray.length) {
            const activeCells = this.cellsArray[this.tabActive];
            this.position.set(activeCells.viewPosition.x, viewPosition.y); 
    
            // カメラの設定
            this.newViewNodes = [];
            const viewBox = new Box(
                this.position.x - 500,
                this.position.y - 500,
                1000,
                1000
            );
    
            // 実際に映っている細胞の産出
            const newViewCells = room.query(viewBox);
            newViewCells.forEach(cell => {
                this.newViewNodes.push(cell.data);
            })
            this.newViewNodes.sort((a, b) => { return a.id - b.id });
    
            // 追加と更新と削除を調べる
            let groupNodes = this.newViewNodes.concat(this.oldViewNodes)
            groupNodes.forEach(item => {
                // Add
                if (this.newViewNodes.includes(item) && !this.oldViewNodes.includes(item)) {
                    this.ws.emitter.addCellQueue.push(item);
                } 
                // Delete
                else if (!this.newViewNodes.includes(item) && this.oldViewNodes.includes(item)) {
                    this.ws.emitter.deleteCellQueue.push(item);
                } 
                // Update
                else {
                    this.ws.emitter.updateCellQueue.push(item);
                }
            });
    
            this.oldViewNodes = this.newViewNodes;
        }
    }

    createCells() {
        if (this.room == null) return;
        const cells = new Cells(this);
        cells.setRoom(this.room);
        cells.spawn();
        this.cellsArray.push(cells);
    }

    setRoom(room) {
        this.room = room;
    }
}

module.exports = Player;