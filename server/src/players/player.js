const UserAccount = require("../commons/account");
const { Box } = require('js-quadtree');
const Vector2 = require("../commons/vector");

class Player {
    constructor(ws, id) {
        this.ws = ws;
        this.isConnected = false;
        this.isJoined = false;
        this.account = new UserAccount();
        this.ipAddress = "";

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

    /**
     * 更新処理
     * @param {*} room 
     */
    update(room) {
        if (!this.isConnected || !this.isJoined) {

        } else {
            this.updateCells(room);
        }

        this.updateViewNodes(room);
    }

    /**
     * 細胞の更新処理
     * @param {*} room 
     */
    updateCells(room) {
        this.cellsArray.forEach(cells => {
            cells.update(room);
        });
    }

    /**
     * カメラに映っている細胞を取り出します
     * @param {*} room 
     */
    updateViewNodes(room) {
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
}

module.exports = Player;