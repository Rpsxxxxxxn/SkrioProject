class Timer {
    constructor(interval) {
        this.interval = interval;
        this.saveTime = Date.now();
    }

    getTiming() {
        if ((Date.now() - this.saveTime) > this.interval) {
            this.saveTime = Date.now();
            return true;
        }
        return false;
    }
}

module.exports = Timer;