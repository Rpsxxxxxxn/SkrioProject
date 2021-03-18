const Bomber = require("../abilities/bomber");
const Gravity = require("../abilities/gravity");
const Reflect = require("../abilities/reflect");
const Teleport = require("../abilities/teleport");
const Cells = require("../players/cells");


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
        }
    }

    handle(reader) {
        const id = reader.getUint8();
        this.router[id](reader);
    }

    playGame(reader) {
        this.ws.player.team = Utility.stringSlice(reader.getString(), 10);
        this.ws.player.name = Utility.stringSlice(reader.getString(), 10);
        this.ws.player.setAbility(reader.getUint8());

        if (!this.ws.player.isJoined) {
            const cells = new Cells(this.ws.player);
            cells.spawn();
            this.ws.player.cellsArray.push(cells);
            this.ws.player.isJoined = true;
        }
    }

    mouseControl(reader) {
        let x = reader.getUint32();
        let y = reader.getUint32();
        this.ws.player.zoomRange = reader.getFloat();
        this.ws.player.mouse.set(x, y);
    }

    tabKeydown() {
        if (this.ws.player.cellsArray.length < 2) {
            const cells = new Cells(this.ws.player);
            cells.spawn();
            this.ws.player.cellsArray.push(cells);
            this.ws.player.tabActive++;
        }

        if (this.ws.player.tabActive < this.ws.player.cellsArray.length) {
            this.ws.player.tabActive++;
        } else {
            this.ws.player.tabActive = 0;
        }
    }

    chatEmit(reader) {
        const message = reader.getString();
        
    }
    
    createAbility(reader) {
        const type = reader.getUint8();

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
}

module.exports = Receiver;