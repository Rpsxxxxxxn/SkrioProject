const Bomber = require("../abilities/bomber");
const Gravity = require("../abilities/gravity");
const Reflect = require("../abilities/reflect");
const Teleport = require("../abilities/teleport");
const config = require("../commons/config");
const Vector2 = require("../commons/vector");


const ABILITY_TYPE = {
    BOMBER: 0,
    GRAVITY: 1,
    REFLECT: 2,
    TELEPORT: 3,
}

class Receiver {
    constructor(ws) {
        this.ws = ws;

        this.router = {
            0: this.playGame.bind(this),
            1: this.mouseControl.bind(this),
            2: this.tabKeydown.bind(this),
            3: this.chatEmit.bind(this),
            4: this.createAbility.bind(this),
            5: this.splitControl.bind(this),
            8: this.ejectControl.bind(this)
        }
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
            this.ws.player.spawn();
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

    chatEmit(reader) {
        const message = reader.getString();
        
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