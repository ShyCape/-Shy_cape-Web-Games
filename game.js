
// === Game Setup ===
const player = document.getElementById('player');
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score-display');
const restartButton = document.getElementById('restart-button');

// Lane variables
const laneWidth = 100; // 500px / 5 lanes
const playerWidth = 90;
const laneCenters = [
    (laneWidth * 0.5) - (playerWidth / 2),
    (laneWidth * 1.5) - (playerWidth / 2),
    (laneWidth * 2.5) - (playerWidth / 2),
    (laneWidth * 3.5) - (playerWidth / 2),
    (laneWidth * 4.5) - (playerWidth / 2)
];
let currentLane;

// Score variables
let score;

// Game loop variables
let obstacleInterval;
let scoreInterval;
let gameLoopInterval;
const obstacleSpeed = 5;

// === Player Movement ===
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        movePlayerLeft();
    } else if (event.key === 'ArrowRight') {
        movePlayerRight();
    }
});

function movePlayerLeft() {
    if (currentLane > 0) {
        currentLane--;
        updatePlayerPosition();
    }
}

function movePlayerRight() {
    if (currentLane < laneCenters.length - 1) {
        currentLane++;
        updatePlayerPosition();
    }
}

function updatePlayerPosition() {
    player.style.left = laneCenters[currentLane] + 'px';
}

// === Obstacle Logic ===
function spawnObstacleRow() {
    const numberOfObstacles = Math.floor(Math.random() * 4) + 1; // 1, 2, 3 or 4
    let availableLanes = [0, 1, 2, 3, 4];

    // Shuffle the available lanes array (Fisher-Yates shuffle)
    for (let i = availableLanes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableLanes[i], availableLanes[j]] = [availableLanes[j], availableLanes[i]];
    }

    // Create obstacles in the chosen number of lanes
    for (let i = 0; i < numberOfObstacles; i++) {
        const laneIndex = availableLanes[i];
        createObstacleInLane(laneIndex);
    }
}

function createObstacleInLane(laneIndex) {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    gameBoard.appendChild(obstacle);
    obstacle.style.left = laneCenters[laneIndex] + 'px';
    obstacle.style.top = '-80px';
}

function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    for (const obstacle of obstacles) {
        let obstacleTop = parseInt(obstacle.style.top);
        obstacleTop += obstacleSpeed;
        obstacle.style.top = obstacleTop + 'px';

        if (obstacleTop > 600) {
            obstacle.remove();
        }
    }
}

// === Game State & Collision ===
function checkCollision() {
    const obstacles = document.querySelectorAll('.obstacle');
    const playerRect = player.getBoundingClientRect();

    // Create a smaller, 85x85 hitbox centered inside the 90x90 playerRect
    const hitboxWidth = 85;
    const hitboxHeight = 55;
    const hitbox = {
        left: playerRect.left + (playerRect.width - hitboxWidth) / 2,
        right: playerRect.right - (playerRect.width - hitboxWidth) / 2,
        top: playerRect.top + (playerRect.height - hitboxHeight) / 2,
        bottom: playerRect.bottom - (playerRect.height - hitboxHeight) / 2,
    };

    for (const obstacle of obstacles) {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            hitbox.left < obstacleRect.right &&
            hitbox.right > obstacleRect.left &&
            hitbox.top < obstacleRect.bottom &&
            hitbox.bottom > obstacleRect.top
        ) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(obstacleInterval);
    clearInterval(gameLoopInterval);
    clearInterval(scoreInterval);
    restartButton.style.display = 'block';
}

// === Game Start & Restart ===
function startGame() {
    score = 0;
    currentLane = 1; // Start in the second lane
    updatePlayerPosition();
    scoreDisplay.textContent = `Score: 0`;
    restartButton.style.display = 'none';

    const existingObstacles = document.querySelectorAll('.obstacle');
    for (const obstacle of existingObstacles) {
        obstacle.remove();
    }

    obstacleInterval = setInterval(spawnObstacleRow, 2000);
    scoreInterval = setInterval(() => {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }, 1000);
    gameLoopInterval = setInterval(() => {
        moveObstacles();
        checkCollision();
    }, 20);
}

restartButton.addEventListener('click', startGame);
startGame();

console.log("Game with multi-obstacle rows loaded!");
