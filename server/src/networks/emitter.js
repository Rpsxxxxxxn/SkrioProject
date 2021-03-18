const Writer = require("./writer");

class Emitter {
    constructor(ws) {
        this.ws = ws;
    }

    create() {
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
        console.log(this.ws.player.id)
        this.send(writer.toBuffer());
    }

    // 10 -------------------------------------------------
    playerUpdate() {
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
    cellUpdate() {
        const writer = new Writer();
        writer.setUint8(11);

        // ADD
        writer.setUint16(this.addCellQueue.length);
        this.addCellQueue.forEach((cell) => {
            writer.setUint16(cell.id);
            writer.setUint16(cell.type);
            writer.setUint16(cell.position.x);
            writer.setUint16(cell.position.y);
            writer.setUint16(cell.size);
            if (cell.type == 3) {
                writer.setUint16(cell.player.id);
            }
        })
        this.addCellQueue.length = 0;
        
        // UPDATE
        writer.setUint16(this.updateCellQueue.length);
        this.updateCellQueue.forEach((cell) => {
            writer.setUint16(cell.id);
            writer.setUint16(cell.type);
            writer.setUint16(cell.position.x);
            writer.setUint16(cell.position.y);
            writer.setUint16(cell.size);
            if (cell.type == 3) {
                writer.setUint16(cell.player.id);
            }
        })
        this.updateCellQueue.length = 0;
        
        // DELETE
        writer.setUint16(this.deleteCellQueue.length);
        this.deleteCellQueue.forEach((cell) => {
            writer.setUint16(cell.id);
            writer.setUint16(cell.type);
            if (cell.type == 3) {
                writer.setUint16(cell.player.id);
            }
        })
        this.deleteCellQueue.length = 0;

        this.send(writer.toBuffer());
    }

    // 12 -------------------------------------------------
    updateTeamMember() {
        const writer = new Writer();
        return writer.toBuffer();
    }

    // 20 -------------------------------------------------
    serverMessage() {
        const writer = new Writer();
        return writer.toBuffer();
    }

    // 21 -------------------------------------------------
    chatMessage() {
        const writer = new Writer();
        return writer.toBuffer();
    }

    send(packet) {
        if (this.ws.player.isConnected) {
            this.ws.send(packet, { binary: true });
        }
    }
}

module.exports = Emitter;