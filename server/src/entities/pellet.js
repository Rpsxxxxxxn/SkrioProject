const Cell = require("./cell");

class Pellet extends Cell {
    constructor(component, x, y, mass, color) {
        super(component, 2, x, y, mass, color);
    }
}

module.exports = Pellet;