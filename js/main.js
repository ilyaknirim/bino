import { Game } from "./game.js";
import { TelegramIntegration } from "./telegram.js";

// Получаем элементы DOM
const canvas = document.getElementById("gameCanvas");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restart = document.getElementById("restart");
const shareResult = document.getElementById("shareResult");
const jumpBtn = document.getElementById("jumpBtn");
const duckBtn = document.getElementById("duckBtn");
const userInfo = document.getElementById("userInfo");

// Инициализация Telegram
const telegram = new TelegramIntegration();

// Отображение информации о пользователе Telegram
if (telegram.isTelegramApp && telegram.user) {
    userInfo.textContent = telegram.user.first_name ? 
        `Привет, ${telegram.user.first_name}!` : 
        "Привет, игрок!";
} else {
    userInfo.textContent = "Привет, игрок!";
}

// Загрузка рекорда из localStorage
let highScore = localStorage.getItem('beaver_highscore') || 0;
highScoreEl.textContent = Math.floor(highScore);

// Обработчики событий для мобильных кнопок
jumpBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    if (game) game.beaver.jump();
});

duckBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    if (game) game.beaver.duck(true);
});

duckBtn.addEventListener("touchend", e => {
    e.preventDefault();
    if (game) game.beaver.duck(false);
});

// Создание игры
let game = new Game(canvas);
let last = 0;

// Основной игровой цикл
function loop(time) {
    const dt = (time - last) / 1000;
    last = time;

    game.update(dt);
    game.draw();
    scoreEl.textContent = Math.floor(game.score);

    if (!game.running) {
        const currentScore = Math.floor(game.score);
        finalScore.textContent = currentScore;

        // Проверяем и обновляем рекорд
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreEl.textContent = highScore;
            localStorage.setItem('beaver_highscore', highScore);

            // Вибрация при установке нового рекорда
            telegram.vibrate('success');

            // Показываем кнопку "Поделиться"
            shareResult.style.display = "inline-block";
        } else {
            shareResult.style.display = "none";
        }

        gameOver.style.display = "flex";

        // Показываем кнопку "Поделиться" в Telegram
        if (telegram.isTelegramApp) {
            telegram.toggleMainButton(true);
        }

        return;
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// Обработчики событий для управления с клавиатуры
window.addEventListener("keydown", e => {
    if (!game) return;

    if (e.code === "Space") {
        e.preventDefault();
        game.beaver.jump();
        telegram.vibrate('light');
    }
    if (e.code === "ArrowDown") {
        e.preventDefault();
        game.beaver.duck(true);
    }
});

window.addEventListener("keyup", e => {
    if (!game) return;

    if (e.code === "ArrowDown") {
        e.preventDefault();
        game.beaver.duck(false);
    }
});

// Обработчики событий для управления касанием
let touchY = 0;

canvas.addEventListener("touchstart", e => {
    touchY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    if (!game) return;

    const deltaY = touchY - e.changedTouches[0].clientY;

    if (deltaY > 40) {
        game.beaver.jump();
        telegram.vibrate('light');
    }
    if (deltaY < -40) {
        game.beaver.duck(true);
        telegram.vibrate('light');
        setTimeout(() => game.beaver.duck(false), 300);
    }
});

// Кнопка перезапуска игры
restart.onclick = () => {
    if (telegram.isTelegramApp) {
        telegram.toggleMainButton(false);
        telegram.toggleSecondaryButton(false);
    }

    location.reload();
};

// Кнопка "Поделиться результатом"
shareResult.onclick = () => {
    telegram.shareScore(game.score);
};

// Обработка столкновения - добавляем вибрацию
const originalCheckCollisions = game.checkCollisions.bind(game);
game.checkCollisions = function() {
    const wasRunning = this.running;
    originalCheckCollisions();

    // Если игра остановилась из-за столкновения, вибрируем
    if (wasRunning && !this.running) {
        telegram.vibrate('heavy');
    }
};
