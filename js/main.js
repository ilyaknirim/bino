import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const scoreEl = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restart = document.getElementById("restart");

let game = new Game(canvas);
let last = 0;

function loop(time) {
    const dt = (time - last) / 1000;
    last = time;

    game.update(dt);
    game.draw();
    scoreEl.textContent = Math.floor(game.score);

    if (!game.running) {
        finalScore.textContent = Math.floor(game.score);
        gameOver.style.display = "flex";
        return;
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

window.addEventListener("keydown", e => {
    if (e.code === "Space") game.beaver.jump();
    if (e.code === "ArrowDown") game.beaver.duck(true);
});

window.addEventListener("keyup", e => {
    if (e.code === "ArrowDown") game.beaver.duck(false);
});

restart.onclick = () => location.reload();
