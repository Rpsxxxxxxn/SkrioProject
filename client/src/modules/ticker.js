export class Ticker {
    constructor(interval) {
        this.interval = interval;
        this.tick = Date.now();
        this.delta = Date.now();
    }

    getTiming() {
        const now = Date.now();
        if (now - this.tick > this.interval) {
            this.tick = now;
            return true;
        }
        return false;
    }

    getDeltaTime() {
        const tooktime = Date.now() - this.delta;
        this.delta = Date.now();
        return tooktime;
    }
}