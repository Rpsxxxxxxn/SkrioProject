const Ability = require("./ability");

/** 重力 */
class Gravity extends Ability {
    constructor(parent) {
        super(parent, 30, 10);
    }

    setParam(param) {

    }

    execute() {
        
    }
}

module.exports = Gravity;