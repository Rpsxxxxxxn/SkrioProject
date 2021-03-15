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
        if (this.addCellQueue.length == 0) return;
        const writer = new Writer();
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
        return writer.toBuffer();
    }

    updateCell() {
        if (this.updateCellQueue.length == 0) return;
        const writer = new Writer();
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
        return writer.toBuffer();
    }

    deleteCell() {
        if (this.deleteCellQueue.length == 0) return;
        const writer = new Writer();
        writer.setUint16(this.deleteCellQueue.length);
        this.deleteCellQueue.forEach((cell) => {
            writer.setUint16(cell.id);
            writer.setUint16(cell.type);
            if (cell.type == 3) {
                writer.setUint16(cell.player.id);
            }
        })
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