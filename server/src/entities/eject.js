const Cell = require("./cell");

class Eject extends Cell {
    constructor(component, id, x, y, mass, color) {
        super(component, 1, id, x, y, mass, color);
    }

    update(param) {
        this.splitMove();
        super.update(param);
    }
}

module.exports = Eject;