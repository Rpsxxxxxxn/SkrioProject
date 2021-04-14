const config = require("../commons/config");
const Utility = require("../commons/utility");
const Vector2 = require("../commons/vector");

class Cell {
    /**
     * コンストラクタ
     * @param {*} component 親
     * @param {*} type タイプ { Elect: 1, Pellet: 2, PlayerCell: 3, Virus: 4 }
     * @param {*} id セルID
     * @param {*} x 位置X
     * @param {*} y 位置Y
     * @param {*} mass 質量
     * @param {*} color 色
     */
    constructor(component, type, id, x, y, mass, color) {
        this._component = component;
        this._type = type;
        this._id = id;
        this._position = new Vector2(x, y);
        this._mass = mass;
        this._size = Math.sqrt(this._mass * 100);
        this._color = color;
        this._speed = null;
        this._createdTime = null;

        this._splitAngle = 0.0;
        this._splitSpeed = 0.0;
    
        this._node = null;
    }

    /**
     * 破棄処理
     */
    destroy() {
        this._component = null;
        if (this._position) {
            delete this._position;
            this._position = null;
        }
    }

    /**
     * 更新処理
     * @param {*} param 
     */
    update(param) {
        if (this._node.width != this._size ||
            this._node.height != this._size) {
            this._size = Math.sqrt(this._mass * 100);
        }
        this._position.x = Number.isNaN(this._position.x) ? 0 : this._position.x;
        this._position.y = Number.isNaN(this._position.y) ? 0 : this._position.y;
        this._position.x = Utility.clamp(this._position.x, 0, config.FIELD_SIZE);
        this._position.y = Utility.clamp(this._position.y, 0, config.FIELD_SIZE);
    }

    /**
     * 当たり判定処理
     * @param {*} room 
     * @param {*} cell 
     */
    collision(room, cell) {
        const eatMass = this._mass * config.CELL_EAT_RATE;
        if (eatMass < cell.mass) return;
        const distance = this._position.distance(cell.position);
        if (distance < this._size) {
            // 食べられた側の処理
            cell.setEaten(room, this);
            // 食べた側の処理
            this.setEat(room, cell);
        }
    }

    /**
     * 剛体判定
     * @param {*} room 
     * @param {*} cell 
     */
    rigidbody(room, cell) {
        const radius = this.size + cell.size;
        const distance = this.position.distance(cell.position);
        const push = Math.min((radius - distance) / distance, radius - distance);
        if (push / radius < 0) return;
        // this._splitSpeed *= 0.5;
    
        const ms = this.sizeSquared + cell.sizeSquared;
        const m1 = push * (cell.sizeSquared / ms);
        const m2 = push * (this.sizeSquared / ms);
        const direction = this.position.direction(cell.position);

        this.position.subtract(new Vector2(direction.x * m1, direction.y * m1));
        cell.position.add(new Vector2(direction.x * m2, direction.y * m2));
    }

    /**
     * 分裂の動き
     */
    splitMove() {
        if (this._splitSpeed >= 1) {
            let speed = Math.sqrt(this._splitSpeed * this._splitSpeed / 100);
            speed = Math.min(speed, config.PLAYER_SPLIT_DISTANCE);
            speed = Math.min(speed, this._splitSpeed);
            this._splitSpeed -= speed;
            this._position.x += Math.cos(this._splitAngle) * speed;
            this._position.y += Math.sin(this._splitAngle) * speed;
        }
    }
    // セッター ---------------------------------------------------------------------------

    /**
     * ノードの簡易生成
     */
    setNewNode() {
        this.node = {
            x: this._position.x - this._size,
            y: this._position.y - this._size,
            width: this._size * 2,
            height: this._size * 2,
            cell: this,
        }
    }

    /**
     * 食べる処理
     * @param {*} room 
     * @param {*} cell 
     */
    setEat(room, cell) {
        this._mass += cell.mass;
        if (cell.component != null && cell.type == 3) {
            cell.component.removeCell(cell);
        }
        room.removeQuadNode(cell);
    }

    /**
     * 食べられた処理
     * @param {*} room 
     * @param {*} cell 
     */
    setEaten(room, cell) {
        // Children extends
    }

    /**
     * 分裂時のパラメータ
     * @param {*} value 
     */
    setSplitParams(value) {
        this._splitAngle = value;
        this._splitSpeed = config.PLAYER_SPLIT_DISTANCE;
    }

    /**
     * 生成後からの経過時間
     * @param {*} room 
     */
    getTick(room) {
        return (room.tickTimer - this.createdTime);
    }

    // アクセッサプロパティ 
    set component(value) { this._component = value; };
    get component() { return this._component; };

    set id(value) { this._id = value; };
    get id() { return this._id; };

    set node(value) {  this._node = value; }
    get node() { return this._node; }

    set type(value) { this._type = value; }
    get type() { return this._type; }

    set position(value) { this._position = value; }
    get position() { return this._position; }

    set mass(value) { this._mass = value; }
    get mass() { return this._mass; }

    set size(value) { this._size = value; }
    get size() { return this._size; };

    set createdTime(value) { this._createdTime = value; };
    get createdTime() { return this._createdTime; }

    set speed(value) { this._speed = value; }
    get speed() {
        var speed = 2.1106 / Math.pow(this.size, 0.449);
        this._speed = speed * config.SERVER_LOOP_TIME;
        return this._speed;
    }

    set color(value) { this._color = value; }
    get color() { return this._color; };

    set splitAngle(value) { this._splitAngle = value; };
    get splitAngle() { return this._splitAngle; };
    
    get sizeSquared() { return this._size * this._size; };
    get splitedMass() {
        this._mass /= 2;
        return this._mass;
    }
}

module.exports = Cell;