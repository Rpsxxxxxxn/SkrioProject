export class Touch {
    constructor() {
        this.touchData = new Map();
        document.addEventListener("touchmove", this.onTouchMove.bind(this));
        document.addEventListener("touchdown", this.onTouchDown.bind(this));
        document.addEventListener("touchup", this.onTouchUp.bind(this));
    }

    onTouchMove(event) {
        event.preventDefault();
        if (event.targetTouches > 0) {
            for (let i = 0; i < event.targetTouches.length; i++) {
                const touch = event.targetTouches[i];
                this.touchData.set(i, touch);
            }
        }
    }

    onTouchDown(event) {

    }

    onTouchUp(event) {

    }
}