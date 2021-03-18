const WebSocket = require('ws');
const Logger = require('../commons/logger');
const Player = require('../players/player');
const Emitter = require('./emitter');
const Reader = require('./reader');
const Receiver = require('./receiver');

class Socket {
    constructor(gamecore) {
        this.gamecore = gamecore;
        this.ws = null;
        this.counter = 0;
    }

    create() {
        Logger.info("Create Socket");
        Logger.info("Waiting Player...");
        Logger.info("Server Port: 3000");

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
        Logger.info(`Joined Player IP: ${ws._socket.remoteAddress}:${ws._socket.remotePort}`);
        ws.player = new Player(ws, this.getPlayerCounter());
        ws.receiver = new Receiver(ws);
        ws.emitter = new Emitter(ws);
        ws.emitter.create();
        ws.emitter.setPlayerId();

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
        ws.emit('close');
        ws.removeAllListeners();
    }

    getPlayerCounter() {
        if (this.counter > 2147483647) {
            this.counter = 1;
        }
        return this.counter += 1;
    }
}

module.exports = Socket;