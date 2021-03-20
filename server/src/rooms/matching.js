const Logger = require("../commons/logger");
const Room = require("./room");

class Matching {
    constructor(gamecore) {
        this.gamecore = gamecore;
        this.rooms = [];
        this.waitingClients = [];
    }

    create() {
        Logger.info("Created Matching Server");
        this.createRoom();
    }

    destroy() {
        this.waitingClients.length = 0;
        this.rooms.length = 0;
    }

    update() {
        // 待機中のプレイヤーを全て参加させる
        if (this.waitingClients.length > 0) {
            this.waitingClients.forEach(player => {
                this.rooms[0].joinPlayer(player);
            })
            this.waitingClients.length = 0;
        }

        // ルームの更新
        this.rooms.forEach(room => {
            room.update();
        })
    }

    match() {

    }

    createRoom() {
        const room = new Room(this);
        room.create();
        this.rooms.push(room);
    }

    /**
     * プレイヤーの参加
     * @param {*} player 
     */
    joinPlayer(player) {
        this.waitingClients.push(player);
    }

    /**
     * プレイヤーの退会
     * @param {*} player 
     */
    leavePlayer(player) {
        this.waitingClients.splice(this.waitingClients.indexOf(player), 1);
    }
}

module.exports = Matching;