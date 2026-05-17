// ======================
// CANVAS
// ======================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ======================
// SNAKE
// ======================
let snake = [{ x: 200, y: 200 }];
let dx = 20;
let dy = 0;

// ======================
// FOOD
// ======================
let food = generateFood();

// ======================
// SCORE
// ======================
let score = 0;

// ======================
// GAME OVER
// ======================
let gameOver = false;

// ======================
// GENERATE FOOD
// ======================
function generateFood() {
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

// ======================
// DRAW SNAKE
// ======================
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "green";
        ctx.fillRect(part.x, part.y, 20, 20);
    });
}

// ======================
// DRAW FOOD
// ======================
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// ======================
// DRAW SCORE
// ======================
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Score : " + score, 10, 20);
}

// ======================
// MOVE SNAKE
// ======================
function moveSnake() {
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // ---- WRAP KANAN → KIRI ----
    if (head.x >= canvas.width) {
        head.x = 0;
    }

    // ---- WRAP KIRI → KANAN ----
    if (head.x < 0) {
        head.x = canvas.width - 20;
    }

    // ---- WRAP BAWAH → ATAS ----
    if (head.y >= canvas.height) {
        head.y = 0;
    }

    // ---- WRAP ATAS → BAWAH ----
    if (head.y < 0) {
        head.y = canvas.height - 20;
    }

    // Tambahkan kepala baru
    snake.unshift(head);

    // Hapus ekor
    snake.pop();
}

// ======================
// CHECK FOOD
// ======================
function checkFood() {
    if (
        snake[0].x === food.x &&
        snake[0].y === food.y
    ) {
        // Tambahkan panjang snake
        snake.push({});

        // Generate food baru
        food = generateFood();

        // Tambah skor
        score += 1;
        // Jika mencapai ambang untuk naik level, pause dan tampilkan overlay
        if (levelIndex < levels.length - 1 && score >= levels[levelIndex].threshold) {
            paused = true;
            const nextLevelName = levels[levelIndex + 1].name;
            const nextSpeed = levels[levelIndex + 1].speed;
            showLevelOverlay("Level Selesai!", `Tekan Lanjut Level untuk masuk ke ${nextLevelName} (kecepatan ${nextSpeed} ms)`);
        }
    }
}

// ======================
// CHECK COLLISION
// ======================
function checkCollision() {
    const head = snake[0];

    // ---- TABRAK DIRI SENDIRI ----
    for (let i = 1; i < snake.length; i++) {
        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            gameOver = true;
        }
    }
}

// ======================
// DRAW GAME OVER
// ======================
function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 110, 200);
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 150, 230);
}

// ======================
// KEYBOARD CONTROL
// ======================
document.addEventListener("keydown", function(event) {
    const key = event.key;

    // Atas
    if (key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -20;
    }
    // Bawah
    else if (key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = 20;
    }
    // Kiri
    else if (key === "ArrowLeft" && dx === 0) {
        dx = -20;
        dy = 0;
    }
    // Kanan
    else if (key === "ArrowRight" && dx === 0) {
        dx = 20;
        dy = 0;
    }

    // Restart game jika game over
    if (gameOver && key === "Enter") {
        location.reload();
    }
});

// ======================
// MOUSE CONTROL (OPTIONAL)
// ======================
canvas.addEventListener("click", function(event) {
    // Ambil posisi mouse
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const head = snake[0];

    // Hitung selisih posisi
    const diffX = mouseX - head.x;
    const diffY = mouseY - head.y;

    // Tentukan arah dominan
    if (Math.abs(diffX) > Math.abs(diffY)) {
        dx = diffX > 0 ? 20 : -20;
        dy = 0;
    } else {
        dx = 0;
        dy = diffY > 0 ? 20 : -20;
    }
});

// ======================
// ======================
// LEVELS, PAUSE & SPEED
// ======================
const levelNameEl = document.getElementById("levelName");
const scoreDisplayEl = document.getElementById("scoreDisplay");
const speedDisplayEl = document.getElementById("speedDisplay");
const overlay = document.getElementById("levelOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const nextLevelBtn = document.getElementById("nextLevelBtn");

const levels = [
    { name: "Easy", threshold: 25, speed: 200 },
    { name: "Medium", threshold: 50, speed: 150 },
    { name: "Hard", threshold: Infinity, speed: 75 }
];

let levelIndex = 0;
let speed = levels[levelIndex].speed;
let paused = false;

function updateHUD() {
    levelNameEl.textContent = levels[levelIndex].name;
    scoreDisplayEl.textContent = score;
    speedDisplayEl.textContent = speed;
}

function showLevelOverlay(title, text) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlay.classList.remove("hidden");
}

function hideLevelOverlay() {
    overlay.classList.add("hidden");
}

nextLevelBtn.addEventListener("click", function() {
    // naik level
    if (levelIndex < levels.length - 1) {
        levelIndex += 1;
        speed = levels[levelIndex].speed;

        // reset snake position to give fresh start for next level
        snake = [{ x: 200, y: 200 }];
        dx = 20;
        dy = 0;
        food = generateFood();
    }

    paused = false;
    hideLevelOverlay();
    updateHUD();
});

// ======================
// GAME LOOP
// ======================
function gameLoop() {
    // Bersihkan canvas setiap frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Jika game over → tampilkan teks dan berhenti
    if (gameOver) {
        drawGameOver();
        return;
    }

    // Jika paused karena level complete → tampilkan overlay tapi jangan jalankan logika
    if (paused) {
        drawSnake();
        drawFood();
        updateHUD();
        setTimeout(gameLoop, 100);
        return;
    }

    // Jalankan logika game
    moveSnake();
    checkFood();
    checkCollision();

    // Gambar semua objek
    drawSnake();
    drawFood();
    updateHUD();

    // Ulangi loop (animasi) dengan kecepatan dinamis
    setTimeout(gameLoop, speed);
}

// ======================
// START GAME
// ======================
updateHUD();
gameLoop();