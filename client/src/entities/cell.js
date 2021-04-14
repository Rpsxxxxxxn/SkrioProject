import Utility from "../../../server/src/commons/utility";
import { Vector2 } from "../modules/vector";

export class Cell {
    constructor(player, id, type, x, y, size, color) {
        this.player = player;
        this.id = id;
        this.type = type;
        this.name = "";
        this.position = new Vector2(x, y);
        this.newPosition = new Vector2(x, y);
        this.size = size;
        this.oldSize = size;
        this.newSize = size;
        this.mass = this.size * this.size / 100;
        this.color = color;
    }

    update(x, y, size) {
        this.setPosition(x, y);
        this.setSize(size);
    }

    setPosition(x, y) {
        this.newPosition.set(x, y);
    }

    setSize(size) {
        this.newSize = size;
        this.mass = this.newSize * this.newSize / 100;
    }

    setColor(color) {
        this.color = color;
    }

    draw(saveTime, render) {
        this.position.x = 0.3 * (this.newPosition.x - this.position.x) + this.position.x;
        this.position.y = 0.3 * (this.newPosition.y - this.position.y) + this.position.y;
        this.size = 0.3 * (this.newSize - this.size) + this.size;

        render.startPath();
        render.setFillColor(this.color);
        render.drawCircle(this.position.x, this.position.y, this.size);
        render.drawFill();

        if (this.type === 3) {
            render.setFillColor(`white`);
            render.getContext().font = `${this.size * 0.5}px 'ＭＳ ゴシック'`;
            render.getContext().textAlign = "center";
            if (this.name) {
                render.getContext().fillText(`${this.name}`, this.position.x, this.position.y);
            }
            render.getContext().fillText(`${~~this.mass}`, this.position.x, this.position.y + (this.size * 0.7));
        }
        render.closePath();
    }
}