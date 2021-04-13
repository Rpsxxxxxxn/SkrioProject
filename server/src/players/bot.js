class Bot extends Player {
    constructor(id) {
        super(null, id);

        this.isConnected = true;
        this.isJoined = true;        
    }

    update() {
        super.update();
    }
}