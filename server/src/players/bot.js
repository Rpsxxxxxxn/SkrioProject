class Bot extends Player {
    constructor(id) {
        super(null, id);

        this.isConnected = true;
        this.isJoined = true;        
        
        // 生成
        this.createCells();
    }

    update() {
        super.update();
    }

    
}