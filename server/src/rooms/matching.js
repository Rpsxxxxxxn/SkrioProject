const Room = require("./room");

class Matching {
    constructor(gamecore) {
        this.gamecore = gamecore;
        this.rooms = [];
        this.waitingClients = [];
    }

    create() {
        this.rooms.push(new Room(this));
    }

    destroy() {
        this.waitingClients.clear();
        this.rooms.clear();
    }

    update() {
        // 待機中のプレイヤーを全て参加させる
        if (this.waitingClients.length > 0) {
            this.waitingClients.forEach(player => {
                this.rooms[0].joinPlayer(player);
            })
            this.waitingClients.clear();
        }

        // ルームの更新
        this.rooms.forEach(room => {
            room.update();
        })
    }

    match() {

    }

    /**
     * プレイヤーの参加
     * @param {*} client 
     */
    joinPlayer(client) {
        this.waitingClients.push(client);
    }

    /**
     * プレイヤーの退会
     * @param {*} client 
     */
    leavePlayer(client) {
        this.waitingClients.splice(this.waitingClients.indexOf(client), 1);
    }
}

module.exports = Matching;