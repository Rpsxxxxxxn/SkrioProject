const Vector2 = require("../commons/vector");
const Ability = require("./ability");

/** テレポート */
class Teleport extends Ability {
    constructor(parent) {
        super(parent, 20, 1);
        this._target = new Vector2(0, 0);
    }

    setParam(param) {
        this._target.x = param.position.x;
        this._target.y = param.position.y;
    }

    execute() {
        const cells = parent.cells[parent.tabActive];
        cells.position.x = this._target.x;
        cells.position.y = this._target.y;
    }
}

module.exports = Teleport;