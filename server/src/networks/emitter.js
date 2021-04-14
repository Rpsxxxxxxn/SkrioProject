const Logger = require("../commons/logger");
const Writer = require("./writer");

class Emitter {
    constructor(ws) {
        this.ws = ws;
    }

    create() {
        Logger.debug("Create Player Emitter");
        
        this.addPlayerQueue = [];
        this.updatePlayerQueue = [];
        this.deletePlayerQueue = [];
        this.addCellQueue = [];
        this.updateCellQueue = [];
        this.deleteCellQueue = [];
    }

    // 1 -------------------------------------------------
    setPlayerId() {
        const writer = new Writer();
        writer.setUint8(0);
        writer.setUint32(this.ws.player.id);
        this.send(writer.toBuffer());
    }

    updateViewPosition(client) {
        const writer = new Writer();
        writer.setUint8(1);
        writer.setFloat(client.position.x);
        writer.setFloat(client.position.y);
        this.send(writer.toBuffer());
    }

    updateSpectateViewPosition(client) {
        const writer = new Writer();
        writer.setUint8(1);
        writer.setFloat(client.position.x);
        writer.setFloat(client.position.y);
        return writer.toBuffer();
    }

    // 10 -------------------------------------------------
    updatePlayer() {
        const writer = new Writer();
        writer.setUint8(10);

        // ADD
        writer.setUint16(this.addPlayerQueue.length);
        this.addPlayerQueue.forEach((player) => {
            writer.setUint32(player.id);
            writer.setString(player.team);
            writer.setString(player.name);
        })
        this.addPlayerQueue.length = 0;

        // UPDATE
        writer.setUint16(this.updatePlayerQueue.length);
        this.updatePlayerQueue.forEach((player) => {
            writer.setString(player.team);
            writer.setString(player.name);
        })
        this.updatePlayerQueue.length = 0;

        // DELETE
        writer.setUint16(this.deletePlayerQueue.length);
        this.deletePlayerQueue.forEach((player) => {
            writer.setUint32(player.id);
        })
        this.deletePlayerQueue.length = 0;

        this.send(writer.toBuffer());
    }

    // 11 -------------------------------------------------
    updateCell() {
        const writer = new Writer();
        writer.setUint8(11);

        // ADD
        writer.setUint16(this.addCellQueue.length);
        this.addCellQueue.forEach((cell) => {
            writer.setUint32(cell.id);
            writer.setUint8(cell.type);
            writer.setFloat(cell.position.x);
            writer.setFloat(cell.position.y);
            writer.setUint16(cell.size);
            writer.setString(cell.color);
            if (cell.type == 3) {
                writer.setUint16(cell.component.player.id);
            }
        })
        this.addCellQueue.length = 0;
        
        // UPDATE
        writer.setUint16(this.updateCellQueue.length);
        this.updateCellQueue.forEach((cell) => {
            writer.setUint32(cell.id);
            writer.setUint8(cell.type);
            writer.setFloat(cell.position.x);
            writer.setFloat(cell.position.y);
            writer.setUint16(cell.size >>> 0);
            if (cell.type == 3) {
                writer.setUint16(cell.component.player.id);
            }
        })
        this.updateCellQueue.length = 0;
        
        // DELETE
        writer.setUint16(this.deleteCellQueue.length);
        this.deleteCellQueue.forEach((cell) => {
            writer.setUint32(cell.id);
            writer.setUint8(cell.type);
            if (cell.type == 3) {
                writer.setUint16(cell.component.player.id);
            }
        })
        this.deleteCellQueue.length = 0;

        this.send(writer.toBuffer());
    }

    // 12 -------------------------------------------------
    updateTeamMember(clients) {
        clients.forEach((client) => {
            const writer = new Writer();
            writer.setUint8(40);
            writer.setUint32(client.id);
            writer.setFloat(client.position.x);
            writer.setFloat(client.position.y);
        })
        this.send(writer.toBuffer());
    }


    updateLeaderBoard(clients) {
        const writer = new Writer();
        writer.setUint8(13);
        clients.forEach((client) => {
            writer.setUint32(client.id);
            writer.setString(client.name);
        })
        this.send(writer.toBuffer());
    }

    // 20 -------------------------------------------------
    serverMessage(message) {
        const writer = new Writer();
        return writer.toBuffer();
    }

    // 21 -------------------------------------------------
    chatMessage(name, message) {
        const writer = new Writer();
        writer.setUint8(100);
        writer.setString(name);
        writer.setString(message);
        return writer.toBuffer();
    }

    send(packet) {
        if (this.ws.player.isConnected) {
            this.ws.send(packet, { binary: true });
        }
    }
}

module.exports = Emitter;