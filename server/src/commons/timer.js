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

    get deltaTime() {
        return (Date.now() - this._saveTime);
    }

    get scaleTime() {
        return this.deltaTime * this._scale;
    }
}

module.exports = Timer;