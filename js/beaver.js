export class Beaver {
    constructor(groundY) {
        this.x = 80;
        this.y = groundY - 60;
        this.baseY = this.y;

        this.width = 50;
        this.height = 60;

        this.velY = 0;
        this.gravity = 2000;
        this.jumpForce = -750;

        this.onGround = true;
        this.ducking = false;

        this.runTime = 0;
    }

    jump() {
        if (this.onGround) {
            this.velY = this.jumpForce;
            this.onGround = false;
        }
    }

    duck(state) {
        this.ducking = state;
        this.height = state ? 35 : 60;
    }

    update(dt, groundY) {
        this.runTime += dt;

        this.velY += this.gravity * dt;
        this.y += this.velY * dt;

        if (this.y >= groundY - this.height) {
            this.y = groundY - this.height;
            this.velY = 0;
            this.onGround = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // тело
        ctx.fillStyle = "#8b5a2b";
        ctx.fillRect(0, 10, 45, 30);

        // голова
        ctx.fillRect(35, 0, 25, 25);

        // хвост
        ctx.fillStyle = "#6b3e1e";
        ctx.fillRect(-15, 18, 15, 18);

        // лапки (анимация бега)
        const legOffset = Math.sin(this.runTime * 20) * 5;
        ctx.fillStyle = "#3e2615";
        ctx.fillRect(10, 40, 8, 15 + legOffset);
        ctx.fillRect(30, 40, 8, 15 - legOffset);

        ctx.restore();
    }

    get hitbox() {
        return {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height
        };
    }
}
