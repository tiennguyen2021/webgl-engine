import {Game} from "./Game.js";

function loop() {
    window.game.update();
    requestAnimationFrame(loop);
}

window.addEventListener("load", function(){
    window.game = new Game();
    loop();
});
