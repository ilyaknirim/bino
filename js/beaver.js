export class Beaver {
    constructor(groundY) {
        this.x = 80;
        this.y = groundY - 64;
        this.groundY = groundY;

        this.width = 64;
        this.height = 64;

        this.velY = 0;
        this.gravity = 2200;
        this.jumpForce = -800;

        this.onGround = true;
        this.ducking = false;

        // === СПРАЙТ ===
        this.image = new Image();
        this.image.src = "assets/sprites/beaver.png";

        this.frameIndex = 0;
        this.frameTime = 0;
        this.frameSpeed = 0.08;

        this.states = {
            run: [0, 1, 2, 3],
            jump: [4],
            duck: [5]
        };
    }

    jump() {
        if (this.onGround) {
            this.velY = this.jumpForce;
            this.onGround = false;
        }
    }

    duck(state) {
        this.ducking = state;
        this.height = state ? 40 : 64;
    }

    update(dt) {
        // физика
        this.velY += this.gravity * dt;
        this.y += this.velY * dt;

        if (this.y >= this.groundY - this.height) {
            this.y = this.groundY - this.height;
            this.velY = 0;
            this.onGround = true;
        }

        // анимация
        this.frameTime += dt;

        let currentState = "run";
        if (!this.onGround) currentState = "jump";
        if (this.ducking) currentState = "duck";

        const frames = this.states[currentState];

        if (this.frameTime >= this.frameSpeed) {
            this.frameTime = 0;
            this.frameIndex = (this.frameIndex + 1) % frames.length;
        }

        this.currentFrame = frames[this.frameIndex];
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.currentFrame * 64,
            0,
            64,
            64,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    get hitbox() {
        return {
            x: this.x + 10,
            y: this.y + 10,
            w: this.width - 20,
            h: this.height - 10
        };
    }
}
