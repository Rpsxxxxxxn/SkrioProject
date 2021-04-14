const config = require("./commons/config");
const Logger = require("./commons/logger");
const Socket = require("./networks/socket");
const Matching = require("./rooms/matching");

class GameCore {
    constructor() {}

    /**
     * メインエントリ
     */
    create() {
        Logger.info("Create GameCore Start");
        Logger.debug("Initializing...")

        // ソケットの作成
        this.socket = new Socket(this);
        this.socket.create();

        // マッチングの作成
        this.matching = new Matching(this);
        this.matching.create();
    }

    /**
     * メインループ処理
     */
    update() {
        this.matching.update();
        setTimeout(this.update.bind(this), config.SERVER_LOOP_TIME);
    }
}

module.exports = GameCore;