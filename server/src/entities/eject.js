const Cell = require("./cell");

class Eject extends Cell {
    /**
     * コンストラクタ
     * @param {*} component 親
     * @param {*} id セルID
     * @param {*} x 位置X
     * @param {*} y 位置Y
     * @param {*} mass 質量
     * @param {*} color 色
     */
    constructor(component, id, x, y, mass, color) {
        super(component, 1, id, x, y, mass, color);
    }

    update(param) {
        this.splitMove();
        super.update(param);
    }
}

module.exports = Eject;