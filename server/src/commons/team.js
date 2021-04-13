const Writer = require("../networks/writer");
const config = require("./config");
const Utility = require("./utility");

class Team {
    constructor(id, name, key, color) {
        this._id = id;
        this._name = name; 
        this._key = key;
        this._color = color;
        this._clients = [];
    }

    update() {
        this._clients.forEach((client) => {
            client.ws.updateTeamMember(this._clients);
        })
    }

    joinPlayer(client) {
        this._clients.push(client);
    }

    leavePlayer(client) {
        this._clients.splice(this._clients.indexOf(client), 1);
    }

    set id(value) { this._id = value };
    get id() { return this._id };
    
    set name(value) { this._name = value };
    get name() { return this._name };
    
    set color(value) { this._color = value };
    get color() { return this._color };

    set key(value) { this._key = value };
    get key() { return this._key };
}

class TeamManager {
    constructor() {
        this._teams = [];
        this._counter = 0;
    }

    update() {
        this._teams.forEach((team) => {
            team.update();
        })
    }

    add(name, key, color = Utility.getRandomColor()) {
        this._teams.push(new Team(this.counter, name, key, color));
    }

    remove(id) {
        this._teams.splice(this._teams.findIndex(element => element._id === id), 1);
    }

    get counter() {
        if (this._counter > 2147483647) {
            this._counter = 1;
        }
        return this._counter += 1;
    }
}

module.exports = TeamManager;