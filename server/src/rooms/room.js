const QuadTree = require("quadtree-lib");
const config = require("../commons/config");
const Logger = require('../commons/logger');
const Utility = require("../commons/utility");
const Pellet = require("../entities/pellet");

class Room {
    constructor(container, isLock = false) {
        this._container = container;
        this._options = { width: config.FIELD_SIZE, height: config.FIELD_SIZE, maxElement: 4 };
        this._quadtree = new QuadTree(this.options);
        this._clients = [];
        this._activeCells = [];
        this._counter = 0;
        this._tickTimer = 0;
        this._isLock = isLock;

        this._saveTime = null;
        this._chatHistory = [];
    }

    create() {
        Logger.info("Create Room");

        // 粒出し処理
        for (let i = 0; i < config.FOOD_COUNT; i++) {
            const position = Utility.getRandomPosition();
            const cell = new Pellet(this.counter, position.x, position.y, config.FOOD_SIZE, Utility.getRandomColor());
            this.addQuadNode(cell);
        }

        // 一秒ごとに行う処理
        setInterval(this.updateInterval.bind(this), 1000);
    }

    /**
     * ルーム削除処理
     */
    destroy() {
        this._clients.length = 0;
        this._activeCells.length = 0;
        this._counter = 0;
        if (this._quadtree) {
            delete this._quadtree;
            this._quadtree = null;
        }
    }

    /**
     * 更新処理
     */
    update() {
        this._tickTimer++;

        this._clients.forEach(player => {
            player.update(this);
            player.ws.emitter.updatePlayer();
            player.ws.emitter.updateCell();
        })

        this._activeCells.forEach(cell => {
            if (cell.type != 2) {
                this.updateQuadNode(cell);
            }

            if (cell.type != 3) {
                cell.update();
            }
        });

        this.updatePhysics();
    }

    colliding(value) {
        return this._quadtree.colliding(value);
    }

    /**
     * ４分木の追加
     * @param {*} cell 
     */
    addQuadNode(cell) {
        const size = cell.size;
        let node = { 
            x: cell.position.x - size,
            y: cell.position.y - size,
            width: size * 2,
            height: size * 2,
            cell: cell
        }
        cell.node = node;
        this._quadtree.push(node);
        this._activeCells.push(cell);
    }

    /**
     * ４分木の更新
     * @param {*} cell 
     */
    updateQuadNode(cell) {
        let node = cell.node;
        if (node.x == (cell.position.x - cell.size) &&
            node.y == (cell.position.y - cell.size) &&
            node.width == (cell.size * 2) &&
            node.height == (cell.size * 2)) {
                return;
        }
        // remove
        this._quadtree.remove(node);

        const size = cell.size;
        // new
        node = { 
            x: cell.position.x - size,
            y: cell.position.y - size,
            width: size * 2,
            height: size * 2,
            cell: cell
        }
        this._quadtree.push(node);
        cell.node = node;
    }

    /**
     * ４分木の削除
     * @param {*} cell 
     */
    removeQuadNode(cell) {
        let node = cell.node;
        this._quadtree.remove(node);
        this._activeCells.splice(this._activeCells.indexOf(cell), 1);
    }

    /**
     * 物理演算 当たり判定処理
     */
    updatePhysics() {
        this._activeCells.forEach(cell => {
            const items = this._quadtree.colliding(cell.node);

            if (cell.type === 3) {
                for (let i = 0; i < items.length; i++) {
                    const cellTarget = items[i].cell;
                    // 本体と相手が同じならスキップ
                    if (cell.id === cellTarget.id) continue;
                    // 相手がプレイやー以外なら
                    if (cellTarget.component === null) {
                        cell.collision(this, cellTarget);
                    } else {
                        // 相手がプレイヤー
                        if (cellTarget.component.player.id !== cell.component.player.id ||
                            cellTarget.component.id !== cell.component.id) {
                            cell.collision(this, cellTarget);
                        }
                    }
                }
            }
        })
    }

    /**
     * 一秒ごとに更新
     */
    updateInterval() {
        // リーダーボード処理
        let leaderboard = [];
        this.clients.forEach((client) => {
            leaderboard.push(client);
        })
        leaderboard.sort((a, b) => { return b.totalMass - a.totalMass });
        leaderboard.slice(0, config.LEADERBOARD_MAX);
        
        this.clients.forEach((client) => {
            client.ws.emitter.updateLeaderBoard(leaderboard);
        })

        // 自然減少処理
        this._activeCells.forEach((cell) => {
            if (cell.type === 3) {
                if (cell.mass > config.CELL_MIN_MASS) {
                    cell.mass *= config.PLAYER_CELL_DECAY;
                }
            }
        });
    }

    /**
     * 全員にパケットを送信
     * @param {*} packet 
     */
    broadCastEmitter(packet) {
        this.clients.forEach((client) => {
            client.ws.emitter.send(packet);
        })
    }

    /**
     * チャットの履歴
     * @param {*} message 
     */
    addChatHistory(name, message) {
        this._chatHistory.push({ name, message });
        if (this._chatHistory.length > 10) {
            this._chatHistory.pop();
        }
    }

    /**
     * プレイヤーの追加
     * @param {*} player 
     */
    joinPlayer(player) {
        // プレイヤー情報の送信
        this._clients.forEach((client) => {
            player.ws.emitter.addPlayerQueue.push(client);
        })
        player.ws.emitter.addPlayerQueue.push(player);

        // チャット履歴 送信
        this._chatHistory.forEach((info) => {
            player.ws.emitter.chatMessage(info.name, info.message);
        })

        player.room = this;
        this._clients.push(player);
    }

    /**
     * プレイヤーの退出
     * @param {*} player 
     */
    leavePlayer(player) {
        player.setRoom(null);
        this._clients.splice(this._clients.indexOf(player), 1);
        this._container.joinPlayer(player);
    }

    // アクセッサプロパティ
    set container(value) { this._container = value; };
    get container() { return this._container; };

    set options(value) { this._options = value; };
    get options() { return this._options; };

    set quadtree(value) { this._quadtree = value; };
    get quadtree() { return this._quadtree; };

    set clients(value) { this._clients.push(value); };
    get clients() { return this._clients; };

    set activeCells(value) { this._activeCells.push(value); };
    get activeCells() { return this._activeCells; };

    set counter(value) { this._counter = value; }
    get counter() {
        if (this._counter > 2147483647) {
            this._counter = 1;
        }
        return this._counter += 1;
    }

    get tickTimer() {
        return this._tickTimer;
    }

    get isLock() {
        return this._isLock;
    }

    get isDelete() {
        if (!this._isLock) {
            if (this.clients.length === 0) {
                return true;
            } 
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

module.exports = Room;