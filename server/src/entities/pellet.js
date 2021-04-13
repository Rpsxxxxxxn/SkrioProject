const Cell = require("./cell");

class Pellet extends Cell {
    constructor(id, x, y, mass, color) {
        super(null, 2, id, x, y, mass, color);
    }

    update(param) {
        super.update(param);
    }
}

module.exports = Pellet;