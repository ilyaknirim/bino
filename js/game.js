import { Beaver } from "./beaver.js";
import { Obstacle } from "./obstacles.js";

export class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.w = canvas.width = canvas.clientWidth;
        this.h = canvas.height = canvas.clientHeight;

        this.groundY = this.h - 25;
        this.beaver = new Beaver(this.groundY);

        this.obstacles = [];
        this.speed = 350;
        this.score = 0;
        this.running = true;

        // Добавляем переменные для фона
        this.clouds = this.generateClouds();
        this.backgroundOffset = 0;
    }

    // Генерируем облака для фона
    generateClouds() {
        const clouds = [];
        const count = 5;

        for (let i = 0; i < count; i++) {
            clouds.push({
                x: Math.random() * this.w,
                y: Math.random() * (this.groundY / 2),
                width: 50 + Math.random() * 100,
                height: 30 + Math.random() * 40,
                speed: 20 + Math.random() * 40
            });
        }

        return clouds;
    }

    spawnObstacle() {
        const types = ["stump", "log", "bird"];
        const type = types[Math.floor(Math.random() * types.length)];
        this.obstacles.push(
            new Obstacle(type, this.w + 50, this.groundY, this.speed)
        );
    }

    update(dt) {
        if (!this.running) return;

        this.speed += dt * 5;
        this.score += dt * 10;

        this.beaver.update(dt, this.groundY);

        // Обновляем облака
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed * dt;

            // Если облако вышло за экран, возвращаем его справа
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.w;
                cloud.y = Math.random() * (this.groundY / 2);
            }
        });

        // Обновляем фон
        this.backgroundOffset -= this.speed * 0.2 * dt;
        if (this.backgroundOffset <= -100) {
            this.backgroundOffset = 0;
        }

        if (Math.random() < 0.015) this.spawnObstacle();

        this.obstacles.forEach(o => o.update(dt));
        this.obstacles = this.obstacles.filter(o => o.x + o.w > 0);

        this.checkCollisions();
    }

    checkCollisions() {
        const a = this.beaver.hitbox;

        for (const o of this.obstacles) {
            const b = o.hitbox;
            if (
                a.x < b.x + b.w &&
                a.x + a.w > b.x &&
                a.y < b.y + b.h &&
                a.y + a.h > b.y
            ) {
                this.running = false;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        // Рисуем небо с градиентом
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(1, '#dff6ff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.w, this.groundY);

        // Рисуем облака
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.clouds.forEach(cloud => {
            this.drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });

        // земля
        this.ctx.fillStyle = "#3a5f0b";
        this.ctx.fillRect(0, this.groundY, this.w, 25);

        // Добавляем текстуру на землю
        this.ctx.fillStyle = "#2a4f0b";
        for (let i = 0; i < this.w; i += 40) {
            const offset = (this.backgroundOffset + i) % 80;
            if (offset < 40) {
                this.ctx.fillRect(i, this.groundY + 10, 20, 5);
            }
        }

        this.beaver.draw(this.ctx);
        this.obstacles.forEach(o => o.draw(this.ctx));
    }

    // Метод для рисования облака
    drawCloud(x, y, width, height) {
        // Рисуем облако из нескольких кругов
        this.ctx.beginPath();
        this.ctx.arc(x + width * 0.25, y + height * 0.5, height * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.5, y + height * 0.4, height * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.75, y + height * 0.5, height * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.35, y + height * 0.7, height * 0.4, 0, Math.PI * 2);
        this.ctx.arc(x + width * 0.65, y + height * 0.7, height * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
