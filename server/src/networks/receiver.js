const Bomber = require("../abilities/bomber");
const Gravity = require("../abilities/gravity");
const Reflect = require("../abilities/reflect");
const Teleport = require("../abilities/teleport");
const config = require("../commons/config");
const Utility = require("../commons/utility");
const Vector2 = require("../commons/vector");
const Writer = require("./writer");


const ABILITY_TYPE = {
    BOMBER: 0,
    GRAVITY: 1,
    REFLECT: 2,
    TELEPORT: 3,
}

class Receiver {
    constructor(ws) {
        // Public
        this.ws = ws;

        this.router = {
            0: this.playGame.bind(this),
            1: this.mouseControl.bind(this),
            2: this.tabKeydown.bind(this),
            3: this.addchat.bind(this),
            4: this.createAbility.bind(this),
            5: this.splitControl.bind(this),
            8: this.ejectControl.bind(this)
        }

        // Private
        this._chatRetransmissionTime = 0;
    }

    handle(reader) {
        const id = reader.getUint8();
        this.router[id](reader);
    }

    playGame(reader) {
        this.ws.player.team = reader.getString();
        this.ws.player.name = reader.getString();
        this.createAbility(reader.getUint8());

        if (!this.ws.player.isJoined) {
            this.ws.player.createCells();
            this.ws.player.isJoined = true;
        } else {
            let isNotJoin = false;
            this.ws.player.cellsArray.forEach((cells) => { isNotJoin = cells.isEmpty; });
            if (isNotJoin) {
                this.ws.player.spawn();
            }
        }
    }

    mouseControl(reader) {
        let x = reader.getInt32();
        let y = reader.getInt32();
        this.ws.player.zoomRange = reader.getFloat();
        this.ws.player.mousePosition = new Vector2(x, y);
    }

    tabKeydown() {
        if (this.ws.player.cellsArray.length < config.PLAYER_MAX_DUAL_COUNT) {
            this.ws.player.tabActive += 1;
            this.ws.player.createCells();
        } else {
            this.ws.player.cellsArray[this.ws.player.tabActive].spawn();
            this.ws.player.tabActiveCounter();
        }
    }

    addchat(reader) {
        // 現在時刻
        const nowTime = Date.now();
        // 種類
        const type = reader.getUint8();
        // 再送信制限
        if (nowTime - this._chatRetransmissionTime > config.CHAT_RETRANSMISSION_TIME) {
            const player = this.ws.player;
            if (type === 0) {
                // 全体送信
                const message = Utility.stringSlice(reader.getString(), config.MESSAGE_MAX_LENGTH);
                const packet = this.ws.emitter.chatMessage(player.name, message);
                player.room.broadCastEmitter(packet);
                player.room.addChatHistory(player.name, message);
                this._chatRetransmissionTime = nowTime;
            } else if (type === 1) {
                // チーム内送信
                const message = Utility.stringSlice(reader.getString(), config.MESSAGE_MAX_LENGTH);
                this._chatRetransmissionTime = nowTime;
            } else {
                // 個人送信
                const message = Utility.stringSlice(reader.getString(), config.MESSAGE_MAX_LENGTH);
                this._chatRetransmissionTime = nowTime;
            }
        }
    }
    
    createAbility(type) {
        if (this.ws.player.ability) {
            delete this.ws.player.ability;
            this.ws.player.ability = null;
        } 

        switch (type) {
            case ABILITY_TYPE.BOMBER:
                this.ws.player.ability = new Bomber(this);
                break;
            case ABILITY_TYPE.GRAVITY:
                this.ws.player.ability = new Gravity(this);
                break;
            case ABILITY_TYPE.REFLECT:
                this.ws.player.ability = new Reflect(this);
                break;
            case ABILITY_TYPE.TELEPORT:
                this.ws.player.ability = new Teleport(this);
                break;
        }
    }

    splitControl(reader) {
        this.ws.player.split();
    }
    
    ejectControl(reader) {
        this.ws.player.eject();
    }
}

module.exports = Receiver;