import { GameCore } from "./game";

const gameCore = new GameCore();

function initialize() {
    gameCore.create();
    mainloop();
}

function mainloop() {
    gameCore.update();
    gameCore.draw();
    requestAnimationFrame(mainloop);
}
window.onload = initialize;