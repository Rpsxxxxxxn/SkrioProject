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
        this.nowViewNodes = [];
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
        const position = this.cellsArray[this.tabActive].viewPosition;
        this.position.set(position.x, position.y); 

        // カメラの設定
        this.nowViewNodes = [];
        const viewBox = new Box(
            this.position.x - 500,
            this.position.y - 500,
            1000,
            1000
        );

        // 実際に映っている細胞の産出
        const newViewCells = room.query(viewBox);
        newViewCells.forEach(cell => {
            this.nowViewNodes.push(cell.data);
        })
        this.nowViewNodes.sort((a, b) => { return a.id - b.id });

        // 追加と更新と削除を調べる
        let oldIndex = 0;
        let nowIndex = 0;
        for (; nowIndex < this.nowViewNodes[nowIndex] && oldIndex < this.oldViewNodes[oldIndex];) {
            if (this.nowViewNodes[nowIndex].id < this.oldViewNodes[oldIndex].id) {
                this.ws.emitter.addCellQueue.push(this.nowViewNodes[nowIndex]);
                nowIndex++;
                continue;
            }
            if (this.nowViewNodes[nowIndex].id > this.oldViewNodes[oldIndex].id) {
                this.ws.emitter.deleteCellQueue.push(this.oldViewNodes[oldIndex]);
                oldIndex++;
                continue;
            }
            
            const node = this.nowViewNodes[nowIndex];
            this.ws.emitter.updateCellQueue.push(node);
            nowIndex++;
            oldIndex++;
        }
        for (; nowIndex < this.nowViewNodes.length;) {
            const node = this.nowViewNodes[nowIndex];
            this.ws.emitter.addCellQueue.push(node);
            nowIndex++;
        }
        for (; oldIndex < this.oldViewNodes.length;) {
            const node = this.oldViewNodes[oldIndex];
            this.ws.emitter.deleteCellQueue.push(node);
            oldIndex++;
        }
        this.oldViewNodes = this.nowViewNodes;
    }
}

module.exports = Player;