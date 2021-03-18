export class Reader {
    constructor(view, offset, littleEndian) {
        this.view = view;
        this.offset = offset || 0;
        this.endian = littleEndian;
    }

    getInt8() {
        return this.view.getInt8(this.offset++, this.endian);
    }

    getInt16() {
        let result = this.view.getInt16(this.offset, this.endian);
        this.skipBytes(2);
        return result;
    }

    getInt24() {
        let result = this.view.getInt16(this.offset, this.endian);
        this.skipBytes(3);
        return result;
    }

    getInt32() {
        let result = this.view.getInt32(this.offset, this.endian);
        this.skipBytes(4);
        return result;
    }

    getUint8() {
        return this.view.getUint8(this.offset++, this.endian);
    }

    getUint16() {
        let result = this.view.getUint16(this.offset, this.endian);
        this.skipBytes(2);
        return result;
    }

    getUint24() {
        let result = this.view.getUint16(this.offset, this.endian);
        this.skipBytes(3);
        return result;
    }

    getUint32() {
        let result = this.view.getUint32(this.offset, this.endian);
        this.skipBytes(4);
        return result;
    }

    getFloat() {
        let result = this.view.getFloat32(this.offset, this.endian);
        this.skipBytes(4);
        return result;
    }

    getDouble() {
        let result = this.view.getFloat64(this.offset, this.endian);
        this.skipBytes(8);
        return result;
    }

    getString() {
        let string = "";
        let count = 0;
        const length = this.getUint16();
        while (count < length) {
            string += String.fromCharCode(this.getUint16());
            count += 1;
        }
        return string;
    }

    skipBytes(length) {
        this.offset += length;
    }
}