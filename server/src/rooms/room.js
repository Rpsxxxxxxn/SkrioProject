const { QuadTree, Box, Point, Circle } = require('js-quadtree');

class Room {
    constructor(container) {
        this.container = container;
        this.fieldSize = new Box(0, 0, 14142, 14142);
        this.quadtree = new QuadTree(this.fieldSize);
        this.clients = [];
        this.activeCells = [];
    }

    destroy() {

    }

    update() {
        this.activeCells.forEach(cell => {
            this.updateQuadNode(cell);
        });

        this.updatePhysics();
    }

    addQuadNode(cell) {
        let node = new Circle(cell.position.x, cell.position.y, cell.size, cell);
        cell.setNode(node);
        this.quadtree.insert(node);
    }

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

    removeQuadNode(cell) {
        let node = cell.getNode();
        this.quadtree.remove(node);
    }

    updatePhysics() {
        this.activeCells.forEach(cell => {
            const nodes = this.quadtree.query(cell);
            
            for (let i = 0; i < nodes.length; i++) {
                const cellTarget = nodes.data;
                cell.rigidbody(cellTarget);
            }
        })
    }

    joinPlayer(client) {
        this.clients.push(client);
    }

    leavePlayer(client) {
        this.clients.splice(this.clients.indexOf(client), 1);
    }
}

module.exports = Room;