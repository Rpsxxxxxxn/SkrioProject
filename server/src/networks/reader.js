// Buffer.from
class Reader {
    constructor(message) {
        this.offset = 0;
        this.buffer = message;
    }

    getUint8() {
        return this.buffer.readUInt8(this.offset++);
    }

    getUint16() {
        const value = this.buffer.readUInt16LE(this.offset);
        this.skipByte(2);
        return value;
    }

    getUint24() {
        const value = this.buffer.readUIntLE(this.offset);
        this.skipByte(3);
        return value;
    }

    getUint32() {
        const value = this.buffer.readUInt32LE(this.offset);
        this.skipByte(4);
        return value;
    }

    getInt8() {
        return this.buffer.readInt8(this.offset++);
    }
    
    getInt16() {
        const value = this.buffer.readInt16LE(this.offset);
        this.skipByte(2);
        return value;
    }
    
    getInt24() {
        const value = this.buffer.readIntLE(this.offset);
        this.skipByte(3);
        return value;
    }
    
    getInt32() {
        const value = this.buffer.readInt32LE(this.offset);
        this.skipByte(4);
        return value;
    }
    
    getFloat() {
        const value = this.buffer.readFloatLE(this.offset);
        this.skipByte(4);
        return value;
    }
    
    getDouble() {
        const value = this.buffer.readDoubleLE(this.offset);
        this.skipByte(8);
        return value;
    }

    getString() {
        let value = "";
        const length = this.getUInt16();
        for (let char = '', i = 0; i < length; i++) {
            char = this.getUint16();
            value += char.charAt(0);
        }
        return value;
    }

    skipByte(value) {
        this.offset += value;
    }
}

module.exports = Reader;