// ==================================================================
// DATA
// ==================================================================

const dom = {
    brickArea: document.getElementById("brick-area"),
    ball: document.getElementById("ball"),
    paddle: document.getElementById("paddle"),
    score: document.getElementById("score"),
    livesLeft: document.getElementById("lives"),
    gameOver: document.getElementById("game-over"),
    bricks: [],
};

const game = {
    isPlaying: true,
    livesTotal: 5,
    livesLeft: 5,
    lastTime: 0,
    score: 0,
    hits: 0,
};

const keys = {
    left: false,
    right: false,
    keydown: false,
};

const board = {
    width: 1920,
    height: 1080,
    rows: 8,
    cols: 15,
};

const speedBoost = {
    fourHits: { active: false, used: false },
    twelveHits: { active: false, used: false },
    orangeRow: { active: false, used: false },
    redRow: { active: false, used: false },
};

const paddle = {
    speed: 1,
    width: 160,
    height: 32,
    x: 1920 / 2 - 64,
    y: 1080 - 96,
    CollisionDisabled: false,
};

const ball = {
    speed: 0.7,
    x: 300,
    y: 350,
    size: 16,
    xSpeed: 1,
    ySpeed: 0.5,
};

const brickData = {
    width: 128,
    height: 32,
    color: [
        { min: 90, color: "green" },
        { min: 60, color: "yellow" },
        { min: 30, color: "orange" },
        { min: 0, color: "red" },
    ],

    point: [
        { min: 90, value: 1 },
        { min: 60, value: 3 },
        { min: 30, value: 5 },
        { min: 0, value: 7 },
    ],
    bricks: [],
};

// ==================================================================
// LOOP
// ==================================================================

function gameloop(timestamp) {
    const deltaTime = timestamp - game.lastTime;
    game.lastTime = timestamp;

    update(deltaTime);
    render();
    requestAnimationFrame(gameloop);
}

function update(deltaTime) {
    if (game.isPlaying) {
        movePaddle(deltaTime);
        moveBall(deltaTime);

        wallCollision(ball, board);
        paddleCollision();
        brickCollision();

        addSpeedBoost();
        isGameOver();
    }
}

// ==================================================================
// LOGIC
// ==================================================================

function addSpeedBoost() {
    if (game.hits >= 4) speedBoost.fourHits.active = true;
    if (game.hits >= 12) speedBoost.twelveHits.active = true;

    for (const value of Object.values(speedBoost)) {
        if (value.active === true && value.used === false) {
            value.used = true;
            ball.speed += 0.15;
            paddle.speed += 0.1;
        }
    }
}

function movePaddle(deltaTime) {
    if (keys.left) paddle.x -= paddle.speed * deltaTime;
    if (keys.right) paddle.x += paddle.speed * deltaTime;

    paddle.x = Math.max(0, Math.min(paddle.x, board.width - paddle.width));
}

function moveBall(deltaTime) {
    ball.x += ball.xSpeed * ball.speed * deltaTime;
    ball.y += ball.ySpeed * ball.speed * deltaTime;
}

function calculateBallTrajectory() {
    const ballMiddle = ball.x + ball.size / 2;
    const paddleMiddle = paddle.x + paddle.width / 2;

    const diff = ballMiddle - paddleMiddle;

    ball.xSpeed = diff / paddle.width;

    if (keys.left) ball.xSpeed -= 0.5;
    if (keys.right) ball.xSpeed += 0.5;
}

function brickCollision() {
    for (const brick of brickData.bricks) {
        if (!brick.visible) continue;

        const hit = hitBox(brick);
        if (!hit) continue;

        brick.visible = false;
        game.score += brick.value;
        game.hits++;

        if (hit === "left" || hit === "right") {
            ball.xSpeed *= -1;
        } else {
            ball.ySpeed *= -1;
        }

        if (brick.color === "orange") speedBoost.orangeRow.active = true;
        if (brick.color === "red") speedBoost.redRow.active = true;

        break;
    }
}

function wallCollision(ball, board) {
    //RIGHT WALL
    if (ball.x >= board.width - ball.size) {
        ball.x = board.width - ball.size;
        ball.xSpeed = -Math.abs(ball.xSpeed);
    }

    //LEFT WALL
    if (ball.x <= 0) {
        ball.x = 0;
        ball.xSpeed = Math.abs(ball.xSpeed);
    }

    //FLOOR
    if (ball.y >= board.height - ball.size) {
        ball.y = board.height - ball.size;
        ball.ySpeed = -Math.abs(ball.ySpeed);
        game.livesLeft--;
    }

    //ROOF
    if (ball.y <= 0) {
        paddle.width = 80;
        ball.y = 0;
        ball.ySpeed = Math.abs(ball.ySpeed);
    }
}

function paddleCollision() {
    let hit = hitBox(paddle);

    if (paddle.CollisionDisabled) return;

    switch (hit) {
        case "top":
            ball.y = paddle.y - ball.size;
            ball.ySpeed = -Math.abs(ball.ySpeed);
            calculateBallTrajectory();
            break;
        case "left":
            ball.xSpeed = -Math.abs(ball.xSpeed);
            break;
        case "right":
            ball.xSpeed = Math.abs(ball.xSpeed);
            break;
        case "bottom":
            paddle.CollisionDisabled = true;

            setTimeout(() => {
                paddle.CollisionDisabled = false;
            }, 1000);

            break;
    }
}

function hitBox(object) {
    const ballLeft = ball.x;
    const ballRight = ball.x + ball.size;
    const ballTop = ball.y;
    const ballBottom = ball.y + ball.size;

    const objectLeft = object.x;
    const objectRight = object.x + object.width;
    const objectTop = object.y;
    const objectBottom = object.y + object.height;

    if (
        ballRight < objectLeft ||
        ballLeft > objectRight ||
        ballBottom < objectTop ||
        ballTop > objectBottom
    ) {
        return null;
    }

    const overlapLeft = ballRight - objectLeft;
    const overlapRight = objectRight - ballLeft;
    const overlapTop = ballBottom - objectTop;
    const overlapBottom = objectBottom - ballTop;

    const overlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (overlap == overlapLeft) return "left";
    if (overlap == overlapRight) return "right";
    if (overlap == overlapTop) return "top";
    if (overlap == overlapBottom) return "bottom";
}

function createBrickElements() {
    const fragment = document.createDocumentFragment();
    dom.brickArea.innerHTML = "";

    for (let row = 0; row < board.rows; row++) {
        for (let col = 0; col < board.cols; col++) {
            const index = row * board.cols + col;

            const brick = createBrick(index);
            brickData.bricks.push(brick);

            const brickEl = renderBrick(brick);
            dom.bricks.push(brickEl);
            fragment.append(brickEl);
        }
    }

    dom.brickArea.append(fragment);
}

function createBrick(index) {
    const { x, y } = getBrickCoords(index);

    return {
        id: index,
        visible: true,
        width: 128,
        height: 32,
        x,
        y,
        value: getBrickValue(index),
        color: getBrickColor(index),
    };
}

function getBrickCoords(index) {
    return {
        x: (index % board.cols) * brickData.width,
        y: Math.floor((index / board.cols) * brickData.height),
    };
}

function getBrickValue(index) {
    return brickData.point.find((entry) => entry.min <= index).value;
}

function getBrickColor(index) {
    return brickData.color.find((entry) => entry.min <= index).color;
}

function isGameOver() {
    if (game.livesLeft === 0) {
        game.isPlaying = false;
    }
}

function resetGame() {
    if (!game.isPlaying) {
        game.isPlaying = true;
        game.livesLeft = 5;
        game.score = 0;
        game.hits = 0;

        dom.bricks = [];

        paddle.speed = 1;
        paddle.width = 160;
        paddle.x = 1920 / 2 - 64;

        ball.speed = 0.7;
        ball.x = 300;
        ball.y = 350;
        ball.xSpeed = 1;
        ball.ySpeed = 0.5;

        brickData.bricks = [];

        for (const boost of Object.values(speedBoost)) {
            boost.active = false;
            boost.used = false;
        }

        createBrickElements();
    }
}

// ==================================================================
// RENDER
// ==================================================================

function renderBrick(brick) {
    const el = document.createElement("div");

    el.classList.add("brick");
    el.style.backgroundColor = brick.color;

    return el;
}

function renderBall() {
    dom.ball.style.left = `${ball.x}px`;
    dom.ball.style.top = `${ball.y}px`;
}

function renderPaddle() {
    dom.paddle.style.left = `${paddle.x}px`;
    dom.paddle.style.top = `${paddle.y}px`;
    dom.paddle.style.width = `${paddle.width}px`;
}

function removeBrick() {
    for (const brick of brickData.bricks) {
        const index = brick.id;

        if (!brick.visible) {
            dom.bricks[index].classList.add("hidden");
        }
    }
}

function renderScore() {
    dom.score.textContent = `Score: ${game.score}`;
}

function renderLivesLeft() {
    const filled = "❤️".repeat(game.livesLeft);
    const empty = "🤍".repeat(game.livesTotal - game.livesLeft);

    dom.livesLeft.textContent = `Lives left: ${filled}${empty}`;
}

function renderGameOver() {
    if (!game.isPlaying) {
        dom.gameOver.classList.remove("hidden");
    } else {
        dom.gameOver.classList.add("hidden");
    }
}

function render() {
    renderBall();
    renderPaddle();
    removeBrick();
    renderScore();
    renderLivesLeft();
    renderGameOver();
}

// ==================================================================
// EVENTS
// ==================================================================

document.addEventListener("keydown", (e) => {
    if (e.key == "a" || e.key == "ArrowLeft") keys.left = true;
    if (e.key == "d" || e.key == "ArrowRight") keys.right = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key == "a" || e.key == "ArrowLeft") keys.left = false;
    if (e.key == "d" || e.key == "ArrowRight") keys.right = false;
});

document.addEventListener("keydown", () => {
    if (keys.keydown) return;

    keys.keydown = true;
    resetGame();
});

document.addEventListener("keyup", () => {
    keys.keydown = false;
});

// ==================================================================
// STARTUP
// ==================================================================

createBrickElements();
requestAnimationFrame(gameloop);
