const Cell = require("./cell");

class Virus extends Cell {
    constructor(component, x, y, mass, color) {
        super(component, 4, x, y, mass, color);
    }
}

module.exports = Virus;