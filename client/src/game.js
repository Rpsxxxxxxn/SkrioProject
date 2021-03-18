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
        // レンダラ作成
        this.render = new Render();
        // ソケット作成
        this.socket = new Socket(this);
        this.socket.create();
        // マウス作成
        this.mouse = new Mouse();
        // キーボード作成
        this.keyboard = new Keyboard();
        // カメラ作成
        this.camera = new Camera();
    }

    update() {

    }

    draw() {
        this.render.cleanup();
        this.render.updateCanvasSize();
        this.render.drawGrid(this.camera.getPosition(), this.mouse.getZoom());

        this.viewCells.sort((a, b) => { return a - b });
        this.viewCells.forEach(value => {
            value.draw(this.render);
        });

        if (this.player) {
            this.player.draw(this.render);
        }

        this.render.startPath();
        this.render.setFillColor("#ffffff");
        this.render.drawCircle(0, 0, 10);
        this.render.drawFill();
        this.render.closePath();
    }
}