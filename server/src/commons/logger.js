class Logger {
    static worn(msg) {
        this.log(`\u001B[33m[WORN ] ${msg}`);
    }

    static debug(msg) {
        this.log(`\u001B[1m[DEBUG] ${msg}`);
    }

    static info(msg) {
        this.log(`\u001B[37m[INFO ] ${msg}`);
    }

    static error(msg) {
        this.log(`\u001B[31m[ERROR] ${msg}`);
    }

    static print(msg) {
        this.log(`\u001B[36m[PRINT] ${msg}`);
    }

    static fatal(msg) {
        this.log(`\u001B[31m[FATAL] ${msg}`);
    }

    static log(msg) {
        console.log(msg);
    }
}

module.exports = Logger;