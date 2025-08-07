// Edited by Rinkio-Lab
// This script creates a click effect with customizable parameters.
// It generates colorful balls that appear on mouse clicks and long presses.
// The effect can be customized with different colors, sizes, speeds, and decay rates.


export function clickEffect(options = {}) {
    // 可自定义参数
    const config = {
        colors: options.colors || ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"],
        minBallSize: options.minBallSize || 5,
        maxBallSize: options.maxBallSize || 12,
        decayRate: options.decayRate || 0.3,
        minBallSpeed: options.minBallSpeed || 6,
        maxBallSpeed: options.maxBallSpeed || 12,
        canvasZIndex: options.zIndex || 99999,
        longPressThreshold: options.longPressThreshold || 500,
    };

    let balls = [];
    let longPressed = false;
    let longPressTimer;
    let multiplier = 0;
    let width, height;
    let ctx;

    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.setAttribute("style", `width:100%;height:100%;top:0;left:0;z-index:${config.canvasZIndex};position:fixed;pointer-events:none;`);
    ctx = canvas.getContext("2d");

    const pointer = document.createElement("span");
    pointer.className = "pointer";
    document.body.appendChild(pointer);

    function updateSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        width = canvas.width;
        height = canvas.height;
    }

    class Ball {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * 2 * Math.PI;
            const speed = longPressed
                ? randBetween(config.maxBallSpeed + multiplier, config.maxBallSpeed + 1 + multiplier)
                : randBetween(config.minBallSpeed, config.maxBallSpeed);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.r = randBetween(config.minBallSize, config.maxBallSize);
            this.color = randomFromArray(config.colors);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.r -= config.decayRate;
            this.vx *= 0.92;
            this.vy *= 0.92;
        }

        draw(ctx) {
            if (this.r <= 0) return;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function randBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function randomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function spawnBalls(count, x, y) {
        for (let i = 0; i < count; i++) {
            balls.push(new Ball(x, y));
        }
    }

    function removeDeadBalls() {
        balls = balls.filter(b => b.r > 0 && b.x + b.r > 0 && b.x - b.r < width && b.y + b.r > 0 && b.y - b.r < height);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        balls.forEach(ball => {
            ball.update();
            ball.draw(ctx);
        });

        if (longPressed) {
            multiplier += 0.3;
        } else if (multiplier > 0) {
            multiplier -= 0.5;
        }

        removeDeadBalls();
        requestAnimationFrame(animate);
    }

    function initListeners() {
        window.addEventListener('resize', updateSize);

        window.addEventListener('mousedown', e => {
            spawnBalls(randBetween(10, 20), e.clientX, e.clientY);
            document.body.classList.add("is-pressed");

            longPressTimer = setTimeout(() => {
                document.body.classList.add("is-longpress");
                longPressed = true;
            }, config.longPressThreshold);
        });

        window.addEventListener('mouseup', e => {
            clearTimeout(longPressTimer);
            if (longPressed) {
                document.body.classList.remove("is-longpress");
                spawnBalls(randBetween(50 + multiplier, 100 + multiplier), e.clientX, e.clientY);
                longPressed = false;
            }
            document.body.classList.remove("is-pressed");
        });

        window.addEventListener('mousemove', e => {
            pointer.style.top = `${e.clientY}px`;
            pointer.style.left = `${e.clientX}px`;
        });
    }

    // 启动特效
    updateSize();
    initListeners();
    animate();
}
