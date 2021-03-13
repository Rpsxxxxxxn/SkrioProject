const Cell = require("./cell");

class PlayerCell extends Cell {
    constructor(component, x, y, mass, color) {
        super(component, 3, x, y, mass, color);
    }

    update() {

    }
}

module.exports = PlayerCell;