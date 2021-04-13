class Vector2 {
    constructor(x, y) {
        this.x = 0 | x;
        this.y = 0 | y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    add(value) {
        this.x += value.x;
        this.y += value.y;
    }

    subtract(value) {
        this.x -= value.x;
        this.y -= value.y;
    }

    multiply(value) {
        this.x *= value.x;
        this.y *= value.y;
    }

    divide(value) {
        this.x /= value.x;
        this.y /= value.y;
    }

    direction(value) {
        return new Vector2(
            value.x - this.x,
            value.y - this.y
        )
    }

    squareMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    magnitude() {
        return Math.sqrt(this.squareMagnitude());
    }

    normalize() {
        let magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
    }

    normalized(x, y) {
        let result = new Vector2(x, y);
        result.normalize();
        return result;
    }

    length(value) {
        const x = value.x - this.x;
        const y = value.y - this.y;
        return new Vector2(x, y);
    }

    distance(value) {
        let tx = value.x - this.x;
        let ty = value.y - this.y;
        return Math.sqrt(tx * tx + ty * ty);
    }

    equals(value) {
        return (this.x == value.x && this.y == value.y);
    }

    lerp(a, b, t) {
        return new Vector2(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t)
    }

    dot(value) {
        return this.x * value.x + this.y * value.y;
    }

    clamp(min, max) {
        this.x = Math.max(Math.min(this.x, max), min);
        this.y = Math.max(Math.min(this.y, max), min);
    }

    clear() {
        this.x = this.y = 0;
    }

    static clone(value) {
        return new Vector2(value.x, value.y);
    }

    static subtract(a, b) {
        let result = Vector2.clone(a).subtract(b);
        return result;
    }

    static Zero() {
        return new Vector2(0, 0);
    }

    static One() {
        return new Vector2(1, 1);
    }

    static Up() {
        return new Vector2(0, 1);
    }
    
    static Down() {
        return new Vector2(0, -1);
    }
    
    static Left() {
        return new Vector2(-1, 0);
    }
    
    static Right() {
        return new Vector2(1, 0);
    }
}

module.exports = Vector2;