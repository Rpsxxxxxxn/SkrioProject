const config = require("../commons/config");
const Utility = require("../commons/utility");
const Vector2 = require("../commons/vector");
const Eject = require("../entities/eject");
const PlayerCell = require("../entities/playercell");

class Cells {
    constructor(player) {
        this._player = player;
        this._id = null;
        this._color = Utility.getRandomColor();
        this._cells = [];
        this._mousePosition = new Vector2(0, 0);
        this._viewPosition = new Vector2(0, 0);
        this._room = null;
        this._isEmpty = true;
    }

    destroy() {
        this._cells.forEach((cell) => {
            this.removeCell(cell);
            this.room.removeQuadNode(cell);
        });
    }

    /**
     * 更新
     */
    update() {
        // 細胞のあるとき
        if (this.cells.length) {
            // カメラ位置のクリア
            this._viewPosition.clear();
            // 自然分裂の処理
            this.autoSplit();
            // セル更新
            this._cells.forEach((cell) => {
                cell.update({ position: this.mousePosition });
                this._viewPosition.add(cell.position);
                
                // セル同士の当たり判定処理
                this._cells.forEach((cellTarget) => {
                    if (cellTarget.id != cell.id &&
                        cellTarget.getTick(this._room) > config.PLAYER_COLLISION_DETECT_TIME &&
                        cell.getTick(this._room) > config.PLAYER_COLLISION_DETECT_TIME) {
                        if (cellTarget.getTick(this._room) > config.SERVER_LOOP_TIME * config.PLAYER_REMERGE_TIME) {
                            // 当たり判定
                            cell.collision(this._room, cellTarget);
                        } else {
                            // 剛体判定
                            cell.rigidbody(this._room, cellTarget);
                        }
                    }
                });
            });
    
            this._viewPosition.x /= this._cells.length;
            this._viewPosition.y /= this._cells.length;
        }
    }

    /**
     * 出現処理
     * @returns 
     */
    spawn() {
        if (this._cells.length > 0) return;
        this.isEmpty = false;
        this.color = Utility.getRandomColor();
        const position = Utility.getRandomPosition();
        const playerCell = new PlayerCell(this, this.room.counter, position.x, position.y, config.PLAYER_START_MASS, this.color);
        playerCell.setNewNode();
        playerCell.createdTime = this._room.tickTimer;
        this.insertCell(playerCell);
        this.room.addQuadNode(playerCell);
    }

    /**
     * 分裂処理
     */
    split() {
        if (this._cells.length > 0 && this._cells.length < config.PLAYER_MIN_CELL_COUNT) {
            const splitCells = [];
            for (let i = 0; i < this._cells.length; i++) {
                if (this._cells[i].mass < config.CELL_MIN_MASS) continue;
                splitCells.push(this._cells[i]);
                if (this._cells.length + splitCells.length >= config.PLAYER_MIN_CELL_COUNT)
                    break;
            }

            for (let i = 0; i < splitCells.length; i++) {
                const cell = splitCells[i];
                const direction = cell.position.direction(this.mousePosition);
                const position = { x: 0, y: 0 };
                let angle = Math.atan2(direction.y, direction.x);
                if (Number.isNaN(angle)) angle = Math.PI / 2;
                position.x = cell.position.x + config.PLAYER_SPLIT_POSITION * Math.cos(angle);
                position.y = cell.position.y + config.PLAYER_SPLIT_POSITION * Math.sin(angle);
                const playerCell = new PlayerCell(this, this.room.counter, position.x, position.y, cell.splitedMass, this.color);
                playerCell.setSplitParams(angle);
                playerCell.setNewNode();
                playerCell.createdTime = this._room.tickTimer;
                this.insertCell(playerCell);
                this.room.addQuadNode(playerCell);
            }
        }
    }

    /**
     * 粒出し処理
     */
    eject() {
        for (let i = 0; i < this._cells.length; i++) {
            const cell = this._cells[i];
            if (cell.mass <= config.CELL_MIN_MASS) continue;
            const direction = cell.position.direction(this.mousePosition);
            const angle = Math.atan2(direction.y, direction.x);
            const position = { x: 0, y: 0 };
            position.x = cell.position.x + (cell.size + config.EJECT_SHOT_POSITION) * Math.cos(angle);
            position.y = cell.position.y + (cell.size + config.EJECT_SHOT_POSITION) * Math.sin(angle);
            const eject = new Eject(null, this.room.counter, position.x, position.y, config.EJECT_MASS, this.color);
            eject.setSplitParams(angle);
            eject.setNewNode();
            cell.mass -= eject.mass;
            this.room.addQuadNode(eject);
        }
    }

    /**
     * 自然分裂
     */
    autoSplit() { 
        if (this._cells.length > 0 && this._cells.length < config.PLAYER_MIN_CELL_COUNT) {
            const splitCells = [];
            for (let i = 0; i < this._cells.length; i++) {
                if (this._cells[i].mass < config.CELL_MAX_MASS) continue;
                splitCells.push(this._cells[i]);
                if (this._cells.length + splitCells.length >= config.PLAYER_MIN_CELL_COUNT)
                    break;
            }

            for (let i = 0; i < splitCells.length; i++) {
                const cell = splitCells[i];
                const direction = cell.position.direction(this.mousePosition);
                const position = { x: 0, y: 0 };
                let angle = Math.atan2(direction.y, direction.x);
                if (Number.isNaN(angle)) angle = Math.PI / 2;
                position.x = cell.position.x + config.PLAYER_SPLIT_POSITION * Math.cos(angle);
                position.y = cell.position.y + config.PLAYER_SPLIT_POSITION * Math.sin(angle);
                const playerCell = new PlayerCell(this, this.room.counter, position.x, position.y, cell.splitedMass, this.color);
                playerCell.setSplitParams(angle);
                playerCell.setNewNode();
                playerCell.createdTime = this._room.tickTimer;
                this.insertCell(playerCell);
                this.room.addQuadNode(playerCell);
            }
        } else if (this._cells.length >= config.PLAYER_MIN_CELL_COUNT) {
            // セルが最大数分裂後の処理
            for (let i = 0; i < this._cells.length; i++) {
                if (this._cells[i].mass < config.CELL_MAX_MASS) continue;
                this._cells[i].mass = config.CELL_MAX_MASS;
            }
        }
    }

    /**
     * セルの追加
     * @param {*} cell 
     */
    insertCell(cell) {
        this._cells.push(cell);
    }

    /**
     * セルの削除
     * @param {*} cell 
     */
    removeCell(cell) {
        this._cells.splice(this._cells.indexOf(cell), 1);
    }

    // アクセッサプロパティ
    set mousePosition(value) { this._mousePosition = value; };
    get mousePosition() { return this._mousePosition; };

    set room(value) { this._room = value; };
    get room() { return this._room; }

    set player(value) { this._player = value; };
    get player() { return this._player; }

    set cells(value) { this._cells = value; };
    get cells() { return this._cells; }

    set id(value) { this._id = value; };
    get id() { return this._id; }

    set viewPosition(value) { this._viewPosition = value; };
    get viewPosition() { return this._viewPosition; }

    set isEmpty(value) { this._isEmpty = value; };
    get isEmpty() { return this._isEmpty; }

    get isAlive() { return this._cells.length > 0; }
}

module.exports = Cells;