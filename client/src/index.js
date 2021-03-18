import { GameCore } from "./game";

const gameCore = new GameCore();

function initialize() {
    gameCore.create();
    mainloop();
}

function mainloop() {
    gameCore.update();
    requestAnimationFrame(mainloop);
}
window.onload = initialize;