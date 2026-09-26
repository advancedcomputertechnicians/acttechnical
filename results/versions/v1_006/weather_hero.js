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
            this.sunSystem = new ShardSystem(this.canvas);
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
            this.sunSystem.update(this.mouse);
            this.sunSystem.draw(this.ctx);
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

class ShardSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.shards = [];
        this.shardCount = 25;
        for (let i = 0; i < this.shardCount; i++) {
            this.shards.push(new LightShard(this.canvas));
        }
    }
    update(mouse) {
        const targetAngle = Math.atan2(mouse.y, mouse.x);
        this.shards.forEach(shard => shard.update(targetAngle));
    }
    draw(ctx) {
        this.shards.forEach(shard => shard.draw(ctx));
    }
}

class LightShard {
    static hues = [180, 280, 60]; // Cyan, Purple, Yellow
    static globalHueIndex = 0;

    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.life = Math.random() * this.maxLife; // Stagger
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.hue = LightShard.hues[LightShard.globalHueIndex % LightShard.hues.length];
        LightShard.globalHueIndex++;
        
        this.length = 50 + Math.random() * 70;
        this.width = 1 + Math.random() * 2;
        this.maxLife = 30 + Math.random() * 30;
        this.life = 0;
        this.speed = 20 + Math.random() * 20; // Surge velocity
        this.angle = Math.random() * Math.PI * 0.5;
        this.opacity = 0;
    }

    update(targetAngle) {
        this.life++;
        
        // Refraction: angle eases toward mouse
        this.angle += (targetAngle - this.angle) * 0.08;
        
        // Physics: Surge moves the shard
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Speed decay for "surge" effect
        this.speed *= 0.94;
        
        // Opacity ramp: quickly appear, then fade
        if (this.life < this.maxLife * 0.2) {
            this.opacity = this.life / (this.maxLife * 0.2);
        } else {
            this.opacity = 1 - (this.life - this.maxLife * 0.2) / (this.maxLife * 0.8);
        }

        if (this.life >= this.maxLife || this.x > this.canvas.width || this.y > this.canvas.height) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity * 0.8})`;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.stroke();

        // Glow head
        ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.length, 0, this.width, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherSystem('particles-js');
});
