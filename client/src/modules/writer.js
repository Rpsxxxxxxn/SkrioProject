class Writer {
    constructor(littleEndian) {
        this.buffer = new DataView(new ArrayBuffer(8));
        this.endian = littleEndian;
        this.reset();
    }

    reset() {
        this.view = [];
        this.offset = 0;
    }

    setUint8(a) {
        if (a >= 0 && a < 256) this.view.push(a);
    }

    setInt8(a) {
        if (a >= -128 && a < 128) this.view.push(a);
    }

    setUint16(a) {
        this.buffer.setUint16(0, a, this.endian);
        this.skipBytes(2);
    }

    setInt16(a) {
        this.buffer.setInt16(0, a, this.endian);
        this.skipBytes(2);
    }

    setUint32(a) {
        this.buffer.setUint32(0, a, this.endian);
        this.skipBytes(4);
    }

    setInt32(a) {
        this.buffer.setInt32(0, a, this.endian);
        this.skipBytes(4);
    }

    setFloat32(a) {
        this.buffer.setFloat32(0, a, this.endian);
        this.skipBytes(4);
    }

    setFloat64(a) {
        this.buffer.setFloat64(0, a, this.endian);
        this.skipBytes(8);
    }

    skipBytes(a) {
        for (let i = 0; i < a; i++)
            this.view.push(this.buffer.getUint8(i));
    }

    setString(s) {
        for (let i = 0; i < s.length; i++)
            this.view.push(s.charCodeAt(i));
    }

    setStringEX(s) {
        this.setUint16(s.length);
        for (let i = 0; i < s.length; i++)
            this.setUint16(s.charCodeAt(i));
    }

    build() {
        return new Uint8Array(this.view);
    }
}
