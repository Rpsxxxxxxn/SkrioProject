import { Vector2 } from "../modules/vector";

export class Camera {
    constructor() {
        this.newPosition = Vector2.Zero();
        this.position = Vector2.Zero();
        this.zoom = 1.0;
        this.newZoom = 1.0;
    }

    update() {
        this.position = Vector2.lerp(this.newPosition, this.position, 0.03);
    }

    setPosition(x, y) {
        this.newPosition.set(x, y);
    }

    getPosition() {
        return this.position;
    }

    getWorldToScreen() {

    }

    getScreenToWorld(render, mouse) {
        const rx = (mouse.position.x - render.canvasWidth / 2) / mouse.viewZoom + this.position.x;
        const ry = (mouse.position.y - render.canvasHeight / 2) / mouse.viewZoom + this.position.y;
        return { x: rx, y: ry };
    }
}