import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const scoreEl = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restart = document.getElementById("restart");
const jumpBtn = document.getElementById("jumpBtn");
const duckBtn = document.getElementById("duckBtn");

jumpBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    game.beaver.jump();
});

duckBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    game.beaver.duck(true);
});

duckBtn.addEventListener("touchend", e => {
    e.preventDefault();
    game.beaver.duck(false);
});

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
let touchY = 0;

canvas.addEventListener("touchstart", e => {
    touchY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    const deltaY = touchY - e.changedTouches[0].clientY;

    if (deltaY > 40) game.beaver.jump();
    if (deltaY < -40) game.beaver.duck(true);

    setTimeout(() => game.beaver.duck(false), 300);
});

restart.onclick = () => location.reload();
