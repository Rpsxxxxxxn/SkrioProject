const { QuadTree, Box, Circle } = require('js-quadtree');

class Room {
    constructor(container) {
        this.container = container;
        this.fieldSize = new Box(0, 0, 14142, 14142);
        this.quadtree = new QuadTree(this.fieldSize);
        this.clients = [];
        this.activeCells = [];
    }

    /**
     * ルーム削除処理
     */
    destroy() {

    }

    /**
     * 更新処理
     */
    update() {
        this.clients.forEach(player => {
            player.update(this);
        })

        this.activeCells.forEach(cell => {
            this.updateQuadNode(cell);
        });

        this.updatePhysics();
    }

    /**
     * 
     * @param {*} point 
     * @returns 
     */
    query(point) {
        return this.quadtree.query(point);
    }

    /**
     * ４分木の追加
     * @param {*} cell 
     */
    addQuadNode(cell) {
        let node = new Circle(cell.position.x, cell.position.y, cell.size, cell);
        cell.setNode(node);
        this.quadtree.insert(node);
    }

    /**
     * ４分木の更新
     * @param {*} cell 
     */
    updateQuadNode(cell) {
        let node = cell.getNode();
        if (node.x != cell.position.x && node.y != cell.position.y && node.r != cell.size) {
            // remove
            this.quadtree.remove(node);

            // new
            node = new Circle(cell.position.x, cell.position.y, cell.size, cell);
            cell.setNode(node);
            this.quadtree.insert(node);
        }
    }

    /**
     * ４分木の削除
     * @param {*} cell 
     */
    removeQuadNode(cell) {
        let node = cell.getNode();
        this.quadtree.remove(node);
    }

    /**
     * 物理演算
     */
    updatePhysics() {
        this.activeCells.forEach(cell => {
            const nodes = this.quadtree.query(cell);
            
            for (let i = 0; i < nodes.length; i++) {
                const cellTarget = nodes.data;
                cell.rigidbody(cellTarget);
            }
        })
    }

    updateFoods() {
        
    }

    /**
     * プレイヤーの追加
     * @param {*} client 
     */
    joinPlayer(client) {
        this.clients.push(client);
    }

    /**
     * プレイヤーの退出
     * @param {*} client 
     */
    leavePlayer(client) {
        this.clients.splice(this.clients.indexOf(client), 1);
    }
}

module.exports = Room;