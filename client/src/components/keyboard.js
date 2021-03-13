export class Keyboard {
    constructor() {
        this.newkey = new Array(256);
        this.oldkey = new Array(256);
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    /**
     * キーの押し込み
     * @param {*} event 
     */
    onKeyDown(event) {
        for (let i = 0; i < 256; i++) {
            if (event.keyCode == i) {
                this.oldkey[i] = this.newkey[i];
                this.newkey[i] = true;
            }
        }
    }

    /**
     * キーの押上
     * @param {*} event 
     */
    onKeyUp(event) {
        for (let i = 0; i < 256; i++) {
            if (event.keyCode == i) {
                this.oldkey[i] = this.newkey[i];
                this.newkey[i] = false;
            }
        }
    }

    /**
     * キーの取得
     * @param {*} keyCode 
     */
    getKeyDown(keyCode) {
        return this.newkey[keyCode];
    }

    /**
     * キーの取得
     * @param {*} keyCode 
     */
    getKeyUp(keyCode) {
        return !this.newkey[keyCode] && this.oldkey[keyCode];
    }

    /**
     * キーの取得
     * @param {*} keyCode 
     */
    getKeyPressed(keyCode) {
        return this.newkey[keyCode] && !this.oldkey[keyCode];
    }
}