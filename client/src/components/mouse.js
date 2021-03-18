import { Vector2 } from "../modules/vector";

export class Mouse {
    constructor() {
        this.position = Vector2.Zero();
        this.zoom = 0.5;
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("mousewheel", this.onMouseWheel.bind(this));
    }

    /**
     * マウスの移動
     * @param {*} event 
     */
    onMouseMove(event) {
        this.position.set(event.clientX, event.clientY);
    }

    /**
     * マウスクリック押込
     * @param {*} event 
     */
    onMouseDown(event) {

    }

    /**
     * マウスクリック押上
     * @param {*} event 
     */
    onMouseUp(event) {

    }

    onMouseWheel(event) {
        this.zoom *= Math.pow(.9, event.wheelDelta / -120 || event.detail || 0);
        this.zoom = Math.min(Math.max(this.zoom, 0.1), 4);
    }

    getZoom() {
        return this.zoom;
    }

    /**
     * マウスの位置取得
     */
    getPosition() {
        return this.position;
    }

    getLeftClick() {
        return true;
    }

    getRightClick() {
        return true;
    }
}