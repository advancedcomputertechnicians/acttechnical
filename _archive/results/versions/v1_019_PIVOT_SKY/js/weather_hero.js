class WeatherSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.states = ['snow', 'rain', 'sun', 'fireworks'];
        this.currentStateIndex = 0;
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.windX = 0;
        
        this.cycleDuration = 45000;
        
        this.init();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.windX = (this.mouse.x / window.innerWidth - 0.5) * 4;
        });

        // v1.016: Robust interactive detonator
        this.canvas.addEventListener('mousedown', (e) => {
            const state = this.states[this.currentStateIndex];
            if (state === 'fireworks' && this.fireworkSystem) {
                // v1.019: King-Size Interactive Burst
                this.fireworkSystem.triggerBurst(e.clientX, e.clientY, true);
            }
        });

        this.interval = setInterval(() => this.nextState(), this.cycleDuration);
    }

    init() {
        this.resize();
        this.setupState();
        this.animate();
    }

    nextState() {
        this.currentStateIndex = (this.currentStateIndex + 1) % this.states.length;
        this.setupState();
        this.restartInterval();
    }

    forceState(name) {
        const index = this.states.indexOf(name);
        if (index !== -1) {
            this.currentStateIndex = index;
            this.setupState();
            this.restartInterval();
        }
    }

    cycleState() {
        this.nextState();
    }

    restartInterval() {
        clearInterval(this.interval);
        this.interval = setInterval(() => this.nextState(), this.cycleDuration);
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
            this.sunSystem = new PhaserSystem(this.canvas);
        } else if (state === 'fireworks') {
            this.fireworkSystem = new FireworkSystem(this.canvas);
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
        } else if (state === 'fireworks') {
            this.fireworkSystem.update();
            this.fireworkSystem.draw(this.ctx);
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
        this.y = -50;
        this.length = Math.random() * 30 + 20;
        this.speedY = (Math.random() * 10 + 10) * 0.8;
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
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
    }
}

class PhaserSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.streaks = [];
        this.count = 60; 
        this.sunPos = { x: -300, y: -300 };
        
        for (let i = 0; i < this.count; i++) {
            this.streaks.push(new PhaserStreak(this.canvas));
        }
    }

    update(mouse) {
        // v1.019: Inverse Solar Pivot (See-Saw) - 300px off-screen
        const margin = 300;
        const invX = 1 - (mouse.x / window.innerWidth);
        const invY = 1 - (mouse.y / window.innerHeight);
        
        this.sunPos.x = invX * (window.innerWidth + margin * 2) - margin;
        this.sunPos.y = invY * (window.innerHeight + margin * 2) - margin;

        this.streaks.forEach(s => s.update(this.sunPos));
    }

    draw(ctx) {
        // v1.019: Atmospheric Inner Glow toward center
        ctx.save();
        const gradient = ctx.createRadialGradient(this.sunPos.x, this.sunPos.y, 0, this.sunPos.x, this.sunPos.y, 400);
        gradient.addColorStop(0, 'rgba(0, 242, 255, 0.15)');
        gradient.addColorStop(0.7, 'rgba(255, 0, 255, 0.02)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.sunPos.x, this.sunPos.y, 400, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        this.streaks.forEach(s => s.draw(ctx));
    }
}

class PhaserStreak {
    static hues = [180, 50, 300]; 

    constructor(canvas) {
        this.canvas = canvas;
        this.hasInitialized = false;
        this.reset({ x: -300, y: -300 });
    }

    reset(origin) {
        this.x = origin.x;
        this.y = origin.y;
        
        this.angle = Math.random() * Math.PI * 2;
        
        this.hue = PhaserStreak.hues[Math.floor(Math.random() * PhaserStreak.hues.length)];
        this.length = 100 + Math.random() * 150;
        
        // v1.019: Slow down by 40% (deliberate atmospheric speed)
        this.speed = (8 + Math.random() * 12) * 0.6; 
        
        this.opacity = 1;
        this.shimmered = false;
        this.life = 0;
        this.maxLife = 100 + Math.random() * 60; // Slightly longer life for slower streaks
        this.hasInitialized = true;
    }

    update(origin) {
        if (!this.hasInitialized) return;

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        if (this.life > this.maxLife * 0.4 && !this.shimmered) {
            this.shimmered = true;
            this.hue = PhaserStreak.hues[Math.floor(Math.random() * PhaserStreak.hues.length)];
            this.opacity = 0;
        } else if (this.opacity < 1) {
            this.opacity += 0.08;
        }

        if (this.life > this.maxLife || 
            this.x < -600 || this.x > this.canvas.width + 600 || 
            this.y < -600 || this.y > this.canvas.height + 600) {
            this.reset(origin);
        }
    }

    draw(ctx) {
        if (!this.hasInitialized) return;
        ctx.save();
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.setLineDash([30, 20, 10, 15]); 
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(this.angle) * this.length, this.y + Math.sin(this.angle) * this.length);
        ctx.stroke();
        ctx.restore();
    }
}

class FireworkSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.shells = [];
        this.sparks = [];
        this.launchRate = 0.05;
    }

    triggerBurst(x, y, isKingSize = false) {
        // v1.019: King-Size Specs (3xParticles, 2x Expansion)
        const sparkCount = (80 + Math.random() * 40) * (isKingSize ? 3 : 1);
        for (let i = 0; i < sparkCount; i++) {
            this.sparks.push(new FireworkSpark(this.canvas, x, y, isKingSize));
        }
    }

    update() {
        if (Math.random() < this.launchRate) {
            this.shells.push(new FireworkShell(this.canvas));
        }

        this.shells.forEach((shell, index) => {
            shell.update();
            if (shell.exploded) {
                this.triggerBurst(shell.x, shell.y);
                this.shells.splice(index, 1);
            }
        });

        this.sparks.forEach((spark, index) => {
            spark.update();
            if (spark.opacity <= 0) {
                this.sparks.splice(index, 1);
            }
        });
    }

    draw(ctx) {
        this.shells.forEach(s => s.draw(ctx));
        this.sparks.forEach(s => s.draw(ctx));
    }
}

class FireworkShell {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = canvas.height * (0.1 + Math.random() * 0.4);
        this.speed = 8 + Math.random() * 5;
        this.exploded = false;
        this.opacity = 1;
    }

    update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
            this.exploded = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class FireworkSpark {
    static hues = [180, 300, 50, 120];

    constructor(canvas, x, y, isKingSize = false) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.origin = { x, y };
        this.angle = Math.random() * Math.PI * 2;
        
        // v1.019: Accelerated King-Size expansion
        const baseSpeed = 2 + Math.random() * 8;
        this.speed = isKingSize ? baseSpeed * 2 : baseSpeed;
        
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.gravity = 0.12;
        this.friction = 0.97;
        this.opacity = 1;
        this.hue = FireworkSpark.hues[Math.floor(Math.random() * FireworkSpark.hues.length)];
        this.shimmered = false;
        this.life = 0;
        this.maxLife = (80 + Math.random() * 60) * (isKingSize ? 1.5 : 1);
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        if (this.life > this.maxLife * 0.3 && !this.shimmered) {
             this.shimmered = true;
             this.hue = FireworkSpark.hues[Math.floor(Math.random() * FireworkSpark.hues.length)];
             this.opacity = 0.9;
        }

        this.opacity = 1 - (this.life / this.maxLife);
    }

    draw(ctx) {
        // v1.019: Cyan/Gold/Magenta Prismatic Shimmer
        ctx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.weatherSystem = new WeatherSystem('particles-js');
});
