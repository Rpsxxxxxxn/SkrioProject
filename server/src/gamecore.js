const Socket = require("./networks/socket");
const Matching = require("./rooms/matching");

// Root Directory
// GameCore > Container | Network > Player > Component | Ability > Entities 
class GameCore {
    constructor() {
        this.settings = {};
    }

    create() {
        this.socket = new Socket(this);
        this.matching = new Matching(this);
    }

    update() {
        this.matching.update();
        
        setTimeout(this.update.bind(this), 1000/25);
    }
}

module.exports = GameCore;