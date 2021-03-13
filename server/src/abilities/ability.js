/** 能力 */
class Ability {
    /**
     * コンストラクタ
     * @param {*} parent 
     * @param {*} interval 
     */
    constructor(parent, interval, duration) {
        this.parent = parent;
        this.interval = interval * 1000;
        this.duration = duration * 1000;
    }

    /**
     * パラメータの設定
     * 派生先で実装
     * @param {*} param 
     */
    setParam(param) {}

    /**
     * 実行
     * 派生先で実装
     */
    execute() {}
}

module.exports = Ability;