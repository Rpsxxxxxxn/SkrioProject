class Remote {
    constructor() {
        
    }

    receive(data) {
        const args = data.split(" ");
        if (args[0] != "/command") return;

    }

    execute(command) {

    }
}

module.exports = Remote;