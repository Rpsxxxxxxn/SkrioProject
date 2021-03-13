const UserAccount = require("../commons/account");
const { Box } = require('js-quadtree');

class Player {
    constructor(ws, id) {
        this.ws = ws;
        this.isConnected = false;
        this.isJoined = false;
        this.account = new UserAccount();
        this.ipAddress = "";

        this.id = id;
        this.team = "";
        this.name = "";
        this.ability = null;
        this.tabActive = 0;
        this.cellsArray = [];
        this.zoomRange = 1.0;
        this.viewBox = new Box(0, 0, 1280, 720);
    }

    update() {
        if (!this.isConnected ||
            !this.isJoined) return;

        this.updateCells();
        this.updateViewBox();
    }

    updateCells() {
        this.cellsArray.forEach(cells => {
            cells.update();
        });
    }

    updateViewBox() {

    }
}

module.exports = Player;