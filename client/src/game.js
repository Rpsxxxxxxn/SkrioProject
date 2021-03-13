import { Cache } from "./components/cache";
import { Keyboard } from "./components/keyboard";
import { Mouse } from "./components/mouse";
import { Camera } from "./entities/Camera";
import { Render } from "./modules/render";
import { Socket } from "./networks/socket";

export class GameCore {
    constructor() {
        this.viewCells = [];
        this.allPlayers = new Cache();
        this.skinURLCache = new Cache();
        this.playerId = -1;
        this.player = null;
        this.mouse = null;
        this.keyboard = null;
        this.camera = null;
    }

    create() {
        this.render = new Render();
        this.socket = new Socket(this);
        this.mouse = new Mouse();
        this.keyboard = new Keyboard();
        this.camera = new Camera();
    }

    update() {

    }

    draw() {
        this.render.cleanup();
        this.viewCells.sort((a, b) => { return a - b });
        this.viewCells.forEach(value => {
            value.draw(this.render);
        });

        if (this.player) {
            this.player.draw(this.render);
        }
    }
}