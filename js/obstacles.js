export class Obstacle {
    constructor(type, x, groundY, speed) {
        this.type = type;
        this.x = x;
        this.speed = speed;

        if (type === "stump") {
            this.w = 30;
            this.h = 40;
            this.y = groundY - this.h;
        }

        if (type === "log") {
            this.w = 60;
            this.h = 25;
            this.y = groundY - this.h;
        }

        if (type === "bird") {
            this.w = 35;
            this.h = 25;
            this.y = groundY - 90;
        }
    }

    update(dt) {
        this.x -= this.speed * dt;
    }

    draw(ctx) {
        ctx.fillStyle =
            this.type === "bird" ? "#444" : "#654321";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    get hitbox() {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
    }
}
