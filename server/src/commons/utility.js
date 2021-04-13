const config = require("./config");
const Vector2 = require("./vector");

class Utility {
    static rgbToHex(r, g, b) {
        const rgb = (r << 16) | (g << 8) | (b << 0);
        return '#' + (0x1000000 + rgb).toString(16).slice(1);
    }

    static hexToRgb(hex) {
        const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (normal) return normal.slice(1).map(e => parseInt(e, 16));
        const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (shorthand) return shorthand.slice(1).map(e => 0x11 * parseInt(e, 16));
        return null;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static stringSlice(value, max) {
        if (value.length > max) {
            return value.slice(max, value.length);
        }
        return value;
    }
    
    static getRandomPosition() {
        const value = new Vector2(0, 0);
        value.x = (Math.random() * 0xffff) % config.FIELD_SIZE;
        value.y = (Math.random() * 0xffff) % config.FIELD_SIZE;
        return value;
    }

    static getRandomColor() {
        const r = this.clamp(Math.random() * 255, 100, 255);
        const g = this.clamp(Math.random() * 255, 100, 255);
        const b = this.clamp(Math.random() * 255, 100, 255);
        return this.rgbToHex(r, g, b);
    }
}

module.exports = Utility;