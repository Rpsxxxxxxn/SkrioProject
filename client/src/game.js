import { Cache } from "./components/cache";
import { Keyboard } from "./components/keyboard";
import { Mouse } from "./components/mouse";
import { Camera } from "./entities/Camera";
import { Render } from "./modules/render";
import { Writer } from "./modules/writer";
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
        
        this.saveTime = null;
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

        setInterval(() => {
            const position = this.camera.getScreenToWorld(this.render, this.mouse);
            const writer = new Writer(true);
            writer.setUint8(1);
            writer.setInt32(position.x);
            writer.setInt32(position.y);
            writer.setFloat32(this.mouse.getZoom());
            this.socket.wsSend(writer);
        }, 1000/20)
    }

    update() {

        if (this.keyboard.getKeyPressed(40)) {
            const writer = new Writer(true);
            writer.setUint8(0);
            writer.setString("もち");
            writer.setString("管理者");
            writer.setUint8(0);
            this.socket.wsSend(writer);
        }

        if (this.keyboard.getKeyPressed(32)) {
            const writer = new Writer(true);
            writer.setUint8(5);
            this.socket.wsSend(writer);
        }

        if (this.keyboard.getKeyDown(69)) {
            const writer = new Writer(true);
            writer.setUint8(8);
            this.socket.wsSend(writer);
        }

        if (this.keyboard.getKeyPressed(81)) {
            const writer = new Writer(true);
            writer.setUint8(2);
            this.socket.wsSend(writer);
        }

        this.keyboard.update();
        this.camera.update();
    }

    draw() {
        this.render.cleanup();
        this.render.updateCanvasSize();
        this.render.drawGrid(this.camera.getPosition(), this.mouse.getZoom());

        this.viewCells.sort((a, b) => { return a.size - b.size });

        this.render.save();
        this.render.zoomScaling(this.camera.getPosition(), this.mouse.getZoom());
        this.render.setStrokeColor("white");
        this.render.getContext().strokeRect(0, 0, 14142, 14142);
        this.viewCells.forEach(value => {
            value.draw(this.saveTime, this.render);
        });
        if (this.player) {
            this.player.draw(this.render);
        }
        this.render.restore();

        this.saveTime = Date.now();
    }
}