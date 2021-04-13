const Cell = require("./cell");

class Virus extends Cell {
    constructor(id, x, y, mass, color) {
        super(null, 4, id, x, y, mass, color);
    }
}

module.exports = Virus;