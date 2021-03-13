import { Vector2 } from "../modules/vector";

export class Camera {
    constructor() {
        this.newPosition = Vector2.Zero();
        this.position = Vector2.Zero();
    }

    update() {
        this.position = Vector2.lerp(this.newPosition, this.position, 0.03);
    }

    setPosition(x, y) {
        this.newPosition.set(x, y);
    }

    getWorldToScreen() {

    }

    getScreenToWorld() {

    }
}