const { Circle } = require("js-quadtree");
const Vector2 = require("../commons/vector");

// Eject 1
// Pellet 2
// PlayerCell 3
// Virus 4
class Cell {
    constructor(component, type, x, y, mass, color) {
        this.component = component;
        this.type = type;
        this.position = new Vector2(x, y);
        this.mass = mass;
        this.size = Math.sqrt(this.mass * 100);
        this.color = color;
        this.speed = 1.0;

        this.splitAngle = 0.0;
        this.splitSpeed = 1.0;
    
        this.node = null;
    }

    destroy() {
        this.component = null;
        if (this.position) {
            delete this.position;
            this.position = null;
        }
    }

    update(position) {
        this.move(position);
    }

    move(target) {
        const tx = target.position.x - this.position.x;
        const ty = target.position.y - this.position.y;
        const angle = Math.atan2(ty, tx);
        
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;
    }

    collision(cell) {
        const eatMass = this.mass *= 1.25;
        if (eatMass < cell.getMass()) return;
        const distance = this.position.distance(cell.getPosition());
        if (distance < this.size) {
            this.setEat(cell);
        }
    }

    rigidbody(cell) {
        const radius = this.getSize() + cell.getSize();
        const distance = this.position.distance(cell.getPosition());
        const push = Math.min((radius - distance) / distance, radius - distance);
        if (push / radius < 0) return;
    
        const ms = this.getSizeSquared() + cell.getSizeSquared();
        const m1 = push * (cell.getSizeSquared() / ms);
        const m2 = push * (this.getSizeSquared() / ms);
        const direction = this.position.direction(cell.getPosition());

        this.position.subtract(new Vector2(direction.x * m1, direction.y * m1));
        cell.position.add(new Vector2(direction.x * m2, direction.y * m2));
    }

    // セッター ---------------------------------------------------------------------------

    newNode() {
        this.node = new Circle(this.position.x, this.position.y, this.size, this);
    }

    setNode(node) {
        this.node = node;
    }

    getNode() {
        return this.node;
    }

    setEat(cell) {

    }

    setKiller(cell) {
        const player = cell.component.player;
    }

    setType(type) {
        this.type = type;
    }

    setPosition(x, y) {
        this.position.set(x, y);
    }

    setMass(mass) {
        this.mass = mass;
    }

    setSize(size) {
        this.size = size;
    }

    setColor(value) {
        this.color = value;
    }

    setSplitParams(value) {
        this.splitAngle = value;
        this.splitSpeed = 1.0;
    }

    getPosition() {
        return this.position;
    }

    getSize() {
        return Math.sqrt(this.mass * 100);
    }
    
    getSizeSquared() {
        return this.size * this.size;
    }

    getMass() {
        return this.mass;
    }
    
    getSplitedMass() {
        this.mass /= 2;
        return this.mass;
    }
}

module.exports = Cell;