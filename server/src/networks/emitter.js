import Writer from "../modules/writer";

export class Emitter {
    constructor(ws) {
        this.ws = ws;

        this.addPlayerQueue = [];
        this.updatePlayerQueue = [];
        this.deletePlayerQueue = [];
        this.addCellQueue = [];
        this.updateCellQueue = [];
        this.deleteCellQueue = [];
    }

    // 1 -------------------------------------------------
    setId(id) {
        const writer = new Writer();
        return writer.toBuffer();
    }

    // 10 -------------------------------------------------
    addPlayer() {
        if (this.addPlayerQueue.length == 0) return;
        const writer = new Writer();
        writer.setUint16(this.addPlayerQueue.length);
        this.addPlayerQueue.forEach(function(player){
            writer.setUint32(player.id);
            writer.setString(player.team);
            writer.setString(player.name);
            writer.setUint16(player.cells.length);
            player.cells.forEach(function(cell) {
                writer.setUint32(cell.id);
                writer.setUint8(cell.type);
                writer.setFloat(cell.position.x);
                writer.setFloat(cell.position.y);
                writer.setUint16(cell.size);
                writer.setString(cell.color);
            })
        })
        return writer.toBuffer();
    }

    updatePlayer() {
        if (this.updatePlayerQueue.length == 0) return;
        const writer = new Writer();
        writer.setUint16(this.updatePlayerQueue.length);
        this.updatePlayerQueue.forEach(function(player) {
            writer.setString(player.team);
            writer.setString(player.name);
        })
        return writer.toBuffer();
    }

    deletePlayer() {
        if (this.deletePlayerQueue.length == 0) return;
        const writer = new Writer();
        writer.setUint16(this.deletePlayerQueue.length);
        this.deletePlayerQueue.forEach(function(player) {
            writer.setUint32(player.id);
        })
        return writer.toBuffer();
    }
    // 11 -------------------------------------------------
    addCell() {
        const writer = new Writer();
        return writer.toBuffer();
    }

    updateCell() {
        const writer = new Writer();
        return writer.toBuffer();
    }

    deleteCell() {
        const writer = new Writer();
        return writer.toBuffer();
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
}