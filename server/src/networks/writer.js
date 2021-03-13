class Writer {
    constructor() {
        this.offset = 0;
        this.buffer = Buffer.allocUnsafe(1048576);
    }

    setUint8(value) {
        this.buffer.writeUInt8(value, this.offset++);
    }
    
    setUint16(value) {
        this.buffer.writeUInt16LE(value, this.offset);
        this.skipByte(2);
    }

    setUint24(value) {
        this.buffer.writeUIntLE(value, this.offset);
        this.skipByte(3);
    }

    setUint32(value) {
        this.buffer.writeUInt32LE(value, this.offset);
        this.skipByte(4);
    }

    setInt8(value) {
        this.buffer.writeInt8(value, this.offset++);
    }
    
    setInt16(value) {
        this.buffer.writeInt16LE(value, this.offset);
        this.skipByte(2);
    }

    setInt24(value) {
        this.buffer.writeIntLE(value, this.offset);
        this.skipByte(3);
    }

    setInt32(value) {
        this.buffer.writeInt32LE(value, this.offset);
        this.skipByte(4);
    }

    setFloat(value) {
        this.buffer.writeFloatLE(value, this.offset);
        this.skipByte(4);
    }

    setDouble(value) {
        this.buffer.writeDoubleLE(value, this.offset);
        this.skipByte(8);
    }

    setString(value) {
        this.setUint16(value.length);
        for (let i = 0; i < value.length; i++) {
            this.setUint16(value.charCodeAt(i));
        }
    }

    skipByte(value) {
        this.offset += value;
    }

    toBuffer() {
        const value = Buffer.allocUnsafe(this.offset);
        this.buffer.copy(value, 0, 0, this.offset);
        return value;
    }
}

module.exports = Writer;