class Reader {
    constructor(view, offset, littleEndian) {
        this.view = view;
        this.offset = offset || 0;
        this.endian = littleEndian;
    }

    getUint8() {
        return this.view.getUint8(this.offset++, this.endian);
    }

    getInt8() {
        return this.view.getInt8(this.offset++, this.endian);
    }

    getUint16() {
        let result = this.view.getUint16(this.offset, this.endian);
        this.skipBytes(2);
        return result;
    }

    getInt16() {
        let result = this.view.getInt16(this.offset, this.endian);
        this.skipBytes(2);
        return result;
    }

    getUint32() {
        let result = this.view.getUint32(this.offset, this.endian);
        this.skipBytes(4);
        return result;
    }

    getInt32() {
        let result = this.view.getInt32(this.offset, this.endian);
        this.skipBytes(4);
        return result;
    }

    getFloat32() {
        let result = this.view.getFloat32(this.offset, this.endian);
        this.skipBytes(4);
        return result;
    }

    getFloat64() {
        let result = this.view.getFloat64(this.offset, this.endian);
        this.skipBytes(8);
        return result;
    }

    getString() {
        let char, name = "";
        while ((char = this.getUint16()) != 0) {
            name += String.fromCharCode(char);
        }
        return name;
    }

    getStringEX() {
        let text = "";
        let len = this.getUint16();
        for (let i = 0; i < len; i++) {
            text += String.fromCharCode(this.getUint16());
        }
        return text;
    }

    skipBytes(length) {
        this.offset += length;
    }
}