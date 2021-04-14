const Cell = require("./cell");

class Virus extends Cell {
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
        super(null, 4, id, x, y, mass, color);
    }

    /**
     * 食べられた側の処理
     * @param {*} room 
     * @param {*} cell 
     */
    setEaten(room, cell) {
        if (cell.type === 3) {
            const cells = cell.component;
            
            // test
            for (let i = 0; i < 4; i++) {
                cells.split();
            }
        }
    }
}

module.exports = Virus;