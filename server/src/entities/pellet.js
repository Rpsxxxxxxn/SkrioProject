const Cell = require("./cell");

class Pellet extends Cell {
    /**
     * コンストラクタ
     * @param {*} component 親
     * @param {*} id セルID
     * @param {*} x 位置X
     * @param {*} y 位置Y
     * @param {*} mass 質量
     * @param {*} color 色
     */
    constructor(id, x, y, mass, color) {
        super(null, 2, id, x, y, mass, color);
    }

    update(param) {
        super.update(param);
    }
}

module.exports = Pellet;