class Timer {
    constructor(interval) {
        this._interval = interval;
        this._scale = 1.0;
        this._saveTime = Date.now();
    }

    getTiming() {
        if ((Date.now() - this._saveTime) > this._interval) {
            this._saveTime = Date.now();
            return true;
        }
        return false;
    }
}

module.exports = Timer;