import { Vector2 } from "../modules/vector";

export class Cell {
    constructor(player, id, type, x, y, size, color) {
        this.player = player;
        this.id = id;
        this.type = type;
        this.position = new Vector2(x, y);
        this.size = size;
        this.mass = this.size * this.size / 100;
        this.color = color;
    }

    update(x, y, size) {
        this.setPosition(x, y);
        this.setSize(size);
    }

    setPosition(x, y) {
        this.position.set(x, y);
    }

    setSize(size) {
        this.size = size;
        this.mass = this.size * this.size / 100;
    }

    setColor(color) {
        this.color = color;
    }

    draw(render) {
        render.startPath();
        render.setFillColor(this.color);
        render.drawCircle(this.position.x, this.position.y, this.size);
        render.drawFill();
        render.closePath();
    }
}