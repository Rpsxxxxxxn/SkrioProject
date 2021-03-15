const WebSocket = require('ws');
const Reader = require('../modules/reader');
const Player = require('../players/player');
const { Emitter } = require('./emitter');
const { Receiver } = require('./receiver');

class Socket {
    constructor(gamecore) {
        this.gamecore = gamecore;
        this.ws = null;
    }

    create() {
        const wsOptions = {
            port: "3000",
            perMessageDeflate: false,
            maxPayload: 4096
        };
        this.ws = new WebSocket.Server(wsOptions);
        this.ws.on("connection", this.onConnection.bind(this));
        this.ws.on("error", this.onError.bind(this));
    }

    onConnection(ws) {
        ws.player = new Player(ws);
        ws.receiver = new Receiver(ws);
        ws.emitter = new Emitter(ws);
        ws.emitter.create();

        ws.on("message", (msg) => {
            this.onMessage(msg, ws);
        });
        ws.on("close", this.onClose.bind(this))
        this.gamecore.matching.joinPlayer(ws.player);
    }

    onError(ws) {

    }

    onMessage(msg, ws) {
        const reader = new Reader(Buffer.from(msg));
        ws.receiver.handle(reader);
    }

    onClose(ws) {
        ws.player.isConnected = false;
        this.gamecore.matching.leavePlayer(ws.player);
    }
}

module.exports = Socket;