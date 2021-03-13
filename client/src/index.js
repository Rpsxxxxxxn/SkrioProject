import { GameCore } from "./game";

const gameCore = new GameCore();
function mainloop() {
    gameCore.create();
    gameCore.update();
    requestAnimationFrame(mainloop);
}
mainloop();