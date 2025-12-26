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

        // земля
        this.ctx.fillStyle = "#3a5f0b";
        this.ctx.fillRect(0, this.groundY, this.w, 25);

        this.beaver.draw(this.ctx);
        this.obstacles.forEach(o => o.draw(this.ctx));
    }
}
