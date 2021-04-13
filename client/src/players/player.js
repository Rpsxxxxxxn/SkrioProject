import { Cell } from "../entities/cell";
import { Vector2 } from "../modules/vector";

export class Player {
    constructor(gamecore, id, team, name) {
        this.gamecore = gamecore;
        this.id = id;
        this.team = team;
        this.name = name;
        this.cells = [];
        this.totalMass = 0;
        this.skinURL = {};
        this.mousePosition = new Vector2(0, 0);
        this.zoomRange = 1.0;
    }

    create() {

    }

    update() {
        this.totalMass = this.cells.reduce((a, b) => a.mass + b.mass);
    }

    draw(render) {
    }

    destroy() {
        this.cells.clear();
        this.skinURL = {};
    }

    /**
     * セルの追加
     * @param {*} id 
     * @param {*} x 
     * @param {*} y 
     * @param {*} size 
     * @param {*} color 
     */
    addCell(id, type, x, y, size, color) {
        const cell = new Cell(this, id, type, x, y, size, color);
        this.cells.push(cell);
        this.gamecore.viewCells.push(cell);
    }

    /**
     * セルの更新
     * @param {*} id 
     * @param {*} x 
     * @param {*} y 
     * @param {*} size 
     */
    updateCell(id, x, y, size) {
        const cell = this.cells.find((v) => v.id == id);
        cell.update(x, y, size);
    }

    /**
     * セルの削除
     * @param {*} id 
     */
    deleteCell(id) {
        let index = this.cells.findIndex((v) => v.id == id);
        this.cells.splice(index, 1);
        index = this.gamecore.viewCells.findIndex((v) => v.id == id);
        this.gamecore.viewCells.splice(index, 1);
    }
    
    /**
     * チームの設定
     * @param {*} team 
     */
    setTeam(team) {
        this.team = team;
    }

    /**
     * 名前の設定
     * @param {*} name 
     */
    setName(name) {
        this.name = name;
    }

    /**
     * マウス位置の設定
     * @param {*} x 
     * @param {*} y 
     */
    setMousePosition(x, y) {
        this.mousePosition.set(x, y);
    }

    /**
     * スキンURLの設定
     * @param {*} index 
     * @param {*} url 
     */
    setSkinURL(index, url) {
        let skinURL = this.skinURL;
        skinURL[index] = url;
        this.skinURL = skinURL;
    }
}