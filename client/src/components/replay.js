import { Ticker } from "../modules/ticker";

export class Replay {
    constructor() {
        this.ticker = new Ticker(null);
        this.time = 0;
        this.keyFrame = 0;
        this.replayData = new Map();
    }

    /**
     * リプレイデータを保存します
     * @param {*} object 
     */
    recording(object) {
        const params = {
            tick: this.ticker.getDeltaTime(),
            data: object
        }
        this.replayData.set(this.keyFrame, params);
        this.keyFrame++;
    }

    /**
     * 再生
     */
    play() {
        if (this.replayData.size() == 0) {
            console.log('リプレイデータがありません');
            return;
        }

        if (!this.replayData.has(this.keyFrame)) {
            console.log('キーフレームがありません。');
        } else {
            let params = this.replayData.get(this.keyFrame);
            if (params.tick > this.time) {
                params.data;
                this.keyFrame++;
            }
            this.time = this.ticker.getDeltaTime();
        }
    }

    /**
     * シーク
     * @param {*} value 
     */
    seek(value) {
        this.keyFrame = value;
        return this.replayData.get(this.keyFrame);
    }

    /**
     * リセット
     */
    reset() {
        this.keyFrame = 0;
    }

    /**
     * 削除
     */
    cleanup() {
        this.reset();
        this.replayData.clear();
    }
}