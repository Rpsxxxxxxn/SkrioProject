const Cell = require("./cell");

class Eject extends Cell {
    constructor(component, x, y, mass, color) {
        super(component, 1, x, y, mass, color);
    }

    update() {
        this.position.x += Math.cos(this.angle) * this.splitSpeed;
        this.position.y += Math.sin(this.angle) * this.splitSpeed;
        this.splitSpeed *= 0.998;
    }
}

module.exports = Eject;