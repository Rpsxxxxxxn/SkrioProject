const UserAccount = require("../commons/account");
const Vector2 = require("../commons/vector");
const Cells = require("./cells");
const Logger = require("../commons/logger");
const config = require("../commons/config");
const Utility = require("../commons/utility");

class Player {
    constructor(ws, id) {
        // Public
        this.ws = ws;
        this.isConnected = false;
        this.isJoined = false;
        this.account = new UserAccount();
        this.ipAddress = ws._socket.remoteAddress;

        // Private
        this._id = id;
        this._team = "";
        this._name = "";
        this._ability = null;
        this._tabActive = 0;
        this._cellsArray = [];
        this._zoomRange = 1.0;
        this._room = null;

        // Player
        this._totalMass = 0;
        this._totalSize = 0;
        
        // Camera
        this._position = new Vector2(0, 0);
        this._oldViewNodes = [];
        this._newViewNodes = [];

        if (!this.isConnected) {
            this.isConnected = true;
        }
    }

    /**
     * 破棄処理
     */
    destroy() {
        this._cellsArray.forEach((cells) => {
            cells.destroy();
        });
        this.isConnected = false;
        this._oldViewNodes.length = 0;
        this._newViewNodes.length = 0;
        this._cellsArray.length = 0;
        if (this._room) {
            delete this._room;
            this._room = null;
        }
        if (this._ability) {
            delete this._ability;
            this._ability = null;
        }
    }

    /**
     * 更新処理
     */
    update() {
        if (this._room != null) {
            if (!this.isConnected || !this.isJoined) {
    
            } else {
                this.updateCells();
            }
    
            this.updateViewNodes();
        }
    }

    /**
     * 細胞の更新処理
     */
    updateCells() {
        this._cellsArray.forEach(cells => {
            if (cells.isAlive) {
                cells.update();
            } else {
                if (!cells.isEmpty) {
                    cells.isEmpty = true;
                    this.tabActiveCounter();
                }
            }
        });
    }

    /**
     * カメラに映っている細胞を取り出します
     */
    updateViewNodes() {
        if (this._cellsArray.length) {
            this._position.clear();
            switch (config.PLAYER_DUAL_CAMERA) {
                case 0:
                    const activeCells = this._cellsArray[this._tabActive];
                    this._position.set(activeCells.viewPosition.x, activeCells.viewPosition.y); 
                    break;
                case 1:
                    this._cellsArray.forEach((cells) => {
                        this._position.add(cells.viewPosition); 
                    })
                    this._position.divideScalar(this._cellsArray.length);
                    break;
            }

            // 位置送信
            this.ws.emitter.updateViewPosition(this);

            // カメラの広さ計算
            this.updateViewScale();

            // カメラの設定
            const viewBox = {
                x: this._position.x - (config.PLAYER_VIEW_SIZE / this._scale),
                y: this._position.y - (config.PLAYER_VIEW_SIZE / this._scale),
                width: ((config.PLAYER_VIEW_SIZE * 2) / this._scale),
                height: ((config.PLAYER_VIEW_SIZE * 2) / this._scale)
            };
            
            // 実際に映っている細胞の産出
            const newViewCells = this._room.colliding(viewBox);
            this._newViewNodes = [];
            newViewCells.forEach(data => {
                this._newViewNodes.push(data.cell);
            })

            this._newViewNodes.sort((a, b) => { return a.id - b.id });
    
            // 追加と更新と削除を調べる
            let groupNodes = this._newViewNodes.concat(this._oldViewNodes)
            groupNodes.forEach(item => {
                // Add
                if (this._newViewNodes.includes(item) && !this._oldViewNodes.includes(item)) {
                    this.ws.emitter.addCellQueue.push(item);
                } 
                // Delete
                else if (!this._newViewNodes.includes(item) && this._oldViewNodes.includes(item)) {
                    this.ws.emitter.deleteCellQueue.push(item);
                } 
                // Update
                else {
                    this.ws.emitter.updateCellQueue.push(item);
                }
            });
    
            this._oldViewNodes = this._newViewNodes;
        }
    }

    createCells() {
        if (this._room == null) return;
        const cells = new Cells(this);
        cells.room = this._room;
        cells.id = this._tabActive;
        cells.spawn();
        this._cellsArray.push(cells);
    }

    tabActiveCounter() {
        this.ws.player.tabActive++;
        if (this.ws.player.tabActive >= this.ws.player.cellsArray.length) {
            this.ws.player.tabActive = 0;
        }
    }

    split() {
        if (this._cellsArray.length) {
            this._cellsArray[this._tabActive].split();
        }
    }
    
    eject() {
        if (this._cellsArray.length) {
            this._cellsArray[this._tabActive].eject();
        }
    }

    updateViewScale() {
        this._totalMass = this._totalSize = 0;
        this._cellsArray[this._tabActive].cells.forEach((cell)=>{
            this._totalSize += cell.size;
            this._totalMass += cell.mass;
        })
        this._scale = Math.pow(Math.min(64 / this._totalSize, 1), config.PLAYER_VIEW_SCALE);
    }

    // アクセッサプロパティ
    set id(value) { this._id = value; }
    get id() { return this._id; };

    set team(value) { 
        this._team = Utility.stringSlice(value, config.PLAYER_TEAM_MAX_LENGTH); 
    }
    get team() { 
        return this._team; 
    };

    set name(value) { 
        this._name = Utility.stringSlice(value, config.PLAYER_NAME_MAX_LENGTH);
    }
    get name() { 
        return this._name; 
    };

    set ability(value) { this._ability = value; }
    get ability() { return this._ability; };
    
    set tabActive(value) { this._tabActive = value; }
    get tabActive() { return this._tabActive; };
    
    set cellsArray(value) { this._cellsArray = value; }
    get cellsArray() { return this._cellsArray; };
    
    set zoomRange(value) { this._zoomRange = value; }
    get zoomRange() { return this._zoomRange; };

    set room(value) { this._room = value; }
    get room() { return this._room; };
    
    set position(value) { this._position = value; }
    get position() { return this._position; };
    
    set totalMass(value) { this._totalMass = value; }
    get totalMass() { return this._totalMass; };
    
    set newViewNodes(value) { this._newViewNodes = value; }
    get newViewNodes() { return this._newViewNodes; };
    
    set oldViewNodes(value) { this._oldViewNodes = value; }
    get oldViewNodes() { return this._oldViewNodes; };
    
    set mousePosition(value) { 
        if (this._cellsArray.length) {
            this._cellsArray[this._tabActive].mousePosition = value;
        }
    }
    get mousePosition() { 
        if (this._cellsArray.length) {
            return this._cellsArray[this._tabActive].mousePosition;
        }
        return null;
    };
}

module.exports = Player;