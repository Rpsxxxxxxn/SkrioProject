const Room = require("./room");

class Matching {
    constructor(gamecore) {
        this.gamecore = gamecore;
        this.rooms = [];
        this.waitingClients = [];
    }

    update() {
        if (this.rooms.length <= 0) {
            const room = new Room();
            this.waitingClients.forEach(client => {
                room.joinPlayer(client);
            });
            this.rooms.push(room);
            this.waitingClients.clear();
        } else {

        }

        this.rooms.forEach(room => {
            room.update();
        })
    }

    match() {

    }

    joinPlayer(client) {
        this.waitingClients.push(client);
    }

    leavePlayer(client) {
        this.waitingClients.splice(this.waitingClients.indexOf(client), 1);
    }
}

module.exports = Matching;