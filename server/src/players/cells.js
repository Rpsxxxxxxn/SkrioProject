const Utility = require("../commons/utility");
const Vector2 = require("../commons/vector");
const PlayerCell = require("../entities/playercell");

class Cells {
    constructor(player) {
        this.player = player;
        this.color = Utility.getRandomColor();
        this.cells = [];
        this.mousePosition = new Vector2(0, 0);
        this.viewPosition = new Vector2(0, 0);
    }

    update() {
        this.viewPosition.clear();
        this.cells.forEach(cell => {
            cell.update(this.parent.mouse);
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
        this.cells.push(playerCell);
    }

    split() {
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells.length >= 16) return;
            const cell = this.cells[i];
            const direction = cell.position.direction(this.mousePosition);
            const angle = Math.atan2(direction.y, direction.x);
            cell.setSplitParams(angle);
            this.cells.push(new PlayerCell(this, 0, cell.position.x, cell.position.y, cell.getSplitedMass(), this.color));
        }
    }

    eject() {
        this.cells.forEach(cell => {
            
        });
    }

    autoSplit() {
        
    }

    isAlive() {
        return cells.length > 0;
    }
}

module.exports = Cells;