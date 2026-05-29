// ==========================
// CANVAS
// ==========================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ==========================
// PANEL LEVEL
// ==========================
const levelPanel = document.getElementById("levelPanel") || document.getElementById("levelOverlay");
const levelText = document.getElementById("levelText") || document.getElementById("overlayTitle");
const scoreText = document.getElementById("scoreText") || document.getElementById("overlayText");
const nextLevelBtn = document.getElementById("nextLevelBtn");

// ==========================
// SNAKE
// ==========================
let snake = [{ x: 200, y: 200 }];

let dx = 20;
let dy = 0;

// ==========================
// FOOD
// ==========================
let food = generateFood();

// ==========================
// SCORE
// ==========================
let score = 0;

// ==========================
// LEVEL
// ==========================
let level = "Level 1";

// speed game
let gameSpeed = 250;

// pause level
let pauseLevel = false;

// game over
let gameOver = false;

// ==========================
// GENERATE FOOD
// ==========================
function generateFood() {
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

// ==========================
// DRAW SNAKE
// ==========================
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "green";
        ctx.fillRect(part.x, part.y, 20, 20);
    });
}

// ==========================
// DRAW FOOD
// ==========================
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// ==========================
// DRAW SCORE
// ==========================
function drawScore() {
    // Update HTML HUD if elements exist
    const levelNameEl = document.getElementById("levelName");
    const scoreDisplayEl = document.getElementById("scoreDisplay");
    const speedDisplayEl = document.getElementById("speedDisplay");

    if (levelNameEl) {
        levelNameEl.textContent = level;
    }
    if (scoreDisplayEl) {
        scoreDisplayEl.textContent = score;
    }
    if (speedDisplayEl) {
        speedDisplayEl.textContent = gameSpeed;
    }
}

// ==========================
// MOVE SNAKE
// ==========================
function moveSnake() {
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // wrap easy-medium
    if (level !== "Level 5") {
        if (head.x >= canvas.width) {
            head.x = 0;
        }
        if (head.x < 0) {
            head.x = canvas.width - 20;
        }
        if (head.y >= canvas.height) {
            head.y = 0;
        }
        if (head.y < 0) {
            head.y = canvas.height - 20;
        }
    }
    // hard mode
    else {
        if (
            head.x < 0 ||
            head.x >= canvas.width - 20 ||
            head.y < 0 ||
            head.y >= canvas.height
        ) {
            gameOver = true;
        }
    }

    snake.unshift(head);
    snake.pop();
}

// ==========================
// CHECK FOOD
// ==========================
function checkFood() {
    if (
        snake[0].x === food.x &&
        snake[0].y === food.y
    ) {
        snake.push({});
        food = generateFood();
        score += 20;
        updateLevel();
    }
}

// ==========================
// UPDATE LEVEL
// ==========================
function updateLevel() {
    // LEVEL 1
    if (score <= 25) {
        if (level !== "Level 1") {
            showLevelTransition("1");
        }
        level = "Level 1";
        gameSpeed = 250;
    }
    // LEVEL 2
    else if (score <= 50) {
        if (level !== "Level 2") {
            showLevelTransition("2");
        }
        level = "Level 2";
        gameSpeed = 200;
    }
    // LEVEL 3
    else if (score <= 75) {
        if (level !== "Level 3") {
            showLevelTransition("3");
        }
        level = "Level 3";
        gameSpeed = 150;
    }
    // LEVEL 4
    else if (score <= 100) {
        if (level !== "Level 4") {
            showLevelTransition("4");
        }
        level = "Level 4";
        gameSpeed = 100;
    }
    // LEVEL 5
    else {
        if (level !== "Level 5") {
            showLevelTransition("5");
        }
        level = "Level 5";
        gameSpeed = 50;
    }
}

// ==========================
// LEVEL TRANSITION
// ==========================
function showLevelTransition(newLevel) {
    pauseLevel = true;
    levelPanel.classList.remove("hidden");
    levelText.innerText = "LEVEL " + newLevel;
    scoreText.innerText = "Score: " + score;
}

// ==========================
// NEXT LEVEL BUTTON
// ==========================
nextLevelBtn.addEventListener("click", () => {
    pauseLevel = false;
    levelPanel.classList.add("hidden");
    gameLoop();
});

// ==========================
// COLLISION BODY
// ==========================
function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            gameOver = true;
        }
    }
}

// ==========================
// GAME OVER
// ==========================
function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 110, 180);

    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    ctx.fillText("Tekan ENTER atau KLIK", 115, 220);
    ctx.fillText("pada kotak untuk Main Lagi", 105, 250);
}

// Click canvas to restart on game over
canvas.addEventListener("click", () => {
    if (gameOver) {
        location.reload();
    }
});

// ==========================
// KEYBOARD
// ==========================
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -20;
    } else if (key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = 20;
    } else if (key === "ArrowLeft" && dx === 0) {
        dx = -20;
        dy = 0;
    } else if (key === "ArrowRight" && dx === 0) {
        dx = 20;
        dy = 0;
    }

    if (gameOver && key === "Enter") {
        location.reload();
    }
});

// ==========================
// GAME LOOP
// ==========================
function gameLoop() {
    if (pauseLevel) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        drawGameOver();
        return;
    }

    moveSnake();
    checkFood();
    checkCollision();
    drawSnake();
    drawFood();
    drawScore();

    setTimeout(gameLoop, gameSpeed);
}

// ==========================
// START GAME
// ==========================
gameLoop();