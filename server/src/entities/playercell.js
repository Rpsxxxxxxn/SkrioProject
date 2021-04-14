const Cell = require("./cell");

class PlayerCell extends Cell {
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
        super(component, 3, id, x, y, mass, color);
    }

    update(param) {
        this.move(param.position);
        this.splitMove();
        super.update(param);
    }

    move(target) {
        const tp = this._position.length(target);
        let angle = Math.atan2(tp.y, tp.x);
        if (Number.isNaN(angle)) angle = Math.PI / 2;
        
        this._position.x += Math.cos(angle) * this.speed;
        this._position.y += Math.sin(angle) * this.speed;
    }

}

module.exports = PlayerCell;