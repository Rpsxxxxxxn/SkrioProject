import { Vector2 } from "../modules/vector";

export class Mouse {
    constructor() {
        this.position = Vector2.Zero();
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
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