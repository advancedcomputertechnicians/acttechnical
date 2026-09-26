class WeatherSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.states = ['snow', 'rain', 'sun'];
        this.currentStateIndex = 0;
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.windX = 0;
        
        this.cycleDuration = 45000;
        
        this.init();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            this.windX = (this.mouse.x / window.innerWidth - 0.5) * 4;
        });

        setInterval(() => this.nextState(), this.cycleDuration);
    }

    init() {
        this.resize();
        this.setupState();
        this.animate();
    }

    nextState() {
        this.currentStateIndex = (this.currentStateIndex + 1) % this.states.length;
        this.setupState();
    }

    setupState() {
        this.particles = [];
        const state = this.states[this.currentStateIndex];
        
        if (state === 'snow' || state === 'rain') {
            const count = state === 'snow' ? 150 : 100;
            for (let i = 0; i < count; i++) {
                this.particles.push(state === 'snow' ? new Snowflake(this.canvas) : new Raindrop(this.canvas));
            }
        } else if (state === 'sun') {
            this.sun = new PrismSun(this.canvas);
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const state = this.states[this.currentStateIndex];

        if (state === 'sun') {
            this.sun.update(this.mouse);
            this.sun.draw(this.ctx);
        } else {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update(this.windX);
                this.particles[i].draw(this.ctx);
            }
        }
        requestAnimationFrame(() => this.animate());
    }
}

class Snowflake {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 1;
        this.velX = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update(windX) {
        this.y += this.speedY;
        this.x += this.velX + windX;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.reset();
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Raindrop {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.length = Math.random() * 20 + 10;
        this.speedY = Math.random() * 10 + 10;
        this.opacity = Math.random() * 0.3 + 0.1;
    }
    update(windX) {
        this.y += this.speedY;
        this.x += windX * 2;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.reset();
    }
    draw(ctx) {
        ctx.strokeStyle = `rgba(0, 242, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
    }
}

class PrismSun {
    constructor(canvas) {
        this.canvas = canvas;
        this.streaks = [];
        this.streakPool = 20;
        for (let i = 0; i < this.streakPool; i++) {
            this.streaks.push(new LightStreak(this.canvas));
        }
    }
    update(mouse) {
        const targetAngle = Math.atan2(mouse.y, mouse.x);
        this.streaks.forEach(streak => streak.update(targetAngle));
    }
    draw(ctx) {
        this.streaks.forEach(streak => streak.draw(ctx));
    }
}

class LightStreak {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.life = Math.random() * this.maxLife; // Stagger initial life
    }
    reset() {
        this.angle = Math.random() * Math.PI * 0.5; // Start within 90deg
        this.width = Math.random() * 0.05 + 0.01;
        this.hue = Math.random() * 360;
        this.maxLife = 100 + Math.random() * 200;
        this.life = 0;
        this.fadeSpeed = 0.01 + Math.random() * 0.02;
        this.opacity = 0;
        this.refractionIndex = 0.02 + Math.random() * 0.08;
    }
    update(targetAngle) {
        // Shimmer: Sine wave for smooth opacity transition
        this.life += 1;
        this.opacity = Math.sin((this.life / this.maxLife) * Math.PI);
        
        // Refraction: Angle pivots toward mouse with randomized easing
        this.angle += (targetAngle - this.angle) * this.refractionIndex;

        if (this.life >= this.maxLife) {
            this.reset();
        }
    }
    draw(ctx) {
        const length = 2000;
        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(this.angle);

        const gradient = ctx.createLinearGradient(0, 0, length, 0);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.opacity * 0.15})`);
        gradient.addColorStop(0.5, `hsla(${this.hue + 20}, 100%, 70%, ${this.opacity * 0.05})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, -length * this.width);
        ctx.lineTo(length, length * this.width);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherSystem('particles-js');
});
