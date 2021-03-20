const Utility = require("../commons/utility");
const Vector2 = require("../commons/vector");
const Eject = require("../entities/eject");
const PlayerCell = require("../entities/playercell");

class Cells {
    constructor(player) {
        this.player = player;
        this.color = Utility.getRandomColor();
        this.cells = [];
        this.mousePosition = new Vector2(0, 0);
        this.viewPosition = new Vector2(0, 0);
        this.room = null;
    }

    update() {
        this.viewPosition.clear();
        this.cells.forEach(cell => {
            cell.update(this.mousePosition);
            this.viewPosition.add(cell.position);
        });

        this.viewPosition.x /= this.cells.length;
        this.viewPosition.y /= this.cells.length;
    }

    spawn() {
        this.color = Utility.getRandomColor();
        if (this.cells > 0) return;
        const position = Utility.getRandomPosition();
        const playerCell = new PlayerCell(this, 0, position.x, position.y, 132, this.color);
        playerCell.newNode();
        this.insertCell(playerCell);
        this.room.addQuadNode(playerCell);
    }

    split() {
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells.length >= 16) return;
            const cell = this.cells[i];
            const direction = cell.position.direction(this.mousePosition);
            const angle = Math.atan2(direction.y, direction.x);
            cell.setSplitParams(angle);
            const playerCell = new PlayerCell(this, 0, cell.position.x, cell.position.y, cell.getSplitedMass(), this.color);
            playerCell.newNode();
            this.insertCell(playerCell);
            this.room.addQuadNode(playerCell);
        }
    }

    eject() {
        this.cells.forEach(cell => {
            const direction = cell.position.direction(this.mousePosition);
            const angle = Math.atan2(direction.y, direction.x);
            cell.setSplitParams(angle);
            const eject = new Eject(this, 0, cell.position.x, cell.position.y, 10, this.color);
            this.room.addQuadNode(eject);
        });
    }

    autoSplit() {
        
    }

    setRoom(room) {
        this.room = room;
    }

    insertCell(cell) {
        this.cells.push(cell);
    }

    isAlive() {
        return cells.length > 0;
    }
}

module.exports = Cells;