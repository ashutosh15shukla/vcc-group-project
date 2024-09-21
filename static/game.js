const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 30;
let maze = [];
let player = {x: 1, y: 1};
let mazeSize = 32;
let endPoint = {x: mazeSize - 2, y: mazeSize - 2};
let playerName = "";
let level = 1;
let startTime;
let timerInterval;
let cheatMode = false;
let speedMode = false;
let cheatSequence = "";
const cheatCode = 'ashu123';
const speedCheatCode = 'mohitspeed';
let moving = {};
let moveInterval = null;

document.getElementById("nameForm").addEventListener("submit", function(event) {
    event.preventDefault();
    playerName = document.getElementById("playerName").value;
    if (!playerName) {
        alert("Please enter your name.");
        return;
    }
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('nameInput').style.display = 'none';
    startTime = Date.now();
    updateTimer();
    fetchMaze(mazeSize);
    updateLevelDisplay();
    updateCheatDisplay();
    updateSpeedDisplay();
});

function updateTimer() {
    timerInterval = setInterval(function() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').textContent = currentTime;
    }, 1000);
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let offsetX = Math.max(0, Math.min(player.x - Math.floor(canvas.width / tileSize / 2), maze[0].length - canvas.width / tileSize));
    let offsetY = Math.max(0, Math.min(player.y - Math.floor(canvas.height / tileSize / 2), maze.length - canvas.height / tileSize));

    for (let y = 0; y < Math.min(maze.length, canvas.height / tileSize); y++) {
        for (let x = 0; x < Math.min(maze[0].length, canvas.width / tileSize); x++) {
            let mazeX = x + offsetX;
            let mazeY = y + offsetY;
            ctx.fillStyle = maze[mazeY][mazeX] === 1 ? '#000' : '#fff';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    ctx.fillStyle = 'green';
    ctx.fillRect((endPoint.x - offsetX) * tileSize, (endPoint.y - offsetY) * tileSize, tileSize, tileSize);

    ctx.fillStyle = 'blue';
    ctx.fillRect((player.x - offsetX) * tileSize, (player.y - offsetY) * tileSize, tileSize, tileSize);
}

function fetchMaze(size) {
    fetch(`/get_maze?size=${size}`)
    .then(response => response.json())
    .then(data => {
        maze = data;
        player = {x: 1, y: 1};
        endPoint = {x: size - 2, y: size - 2};
        drawMaze();
    })
    .catch(error => {
        console.error("Error fetching maze:", error);
    });
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (cheatMode || (maze[newY] && (maze[newY][newX] === 0 || (newX === endPoint.x && newY === endPoint.y)))) {
        player.x = newX;
        player.y = newY;

        if (player.x === endPoint.x && player.y === endPoint.y) {
            nextLevel();
        }

        drawMaze();
    }
}

function updateLevelDisplay() {
    document.getElementById('currentLevel').textContent = level;
}

function updateCheatDisplay() {
    const cheatDisplay = document.getElementById('cheatDisplay');
    cheatDisplay.textContent = cheatMode ? "Cheat Mode Activated" : "";
}

function updateSpeedDisplay() {
    const speedDisplay = document.getElementById('speedDisplay');
    speedDisplay.textContent = speedMode ? "Speed Mode Activated" : "";
}

function nextLevel() {
    level += 1;
    mazeSize *= 2;
    updateLevelDisplay();

    if (mazeSize > 1024) {
        alert("Maximum maze size reached! Game over.");
        quitGame();
    } else {
        fetchMaze(mazeSize);
    }
}

function quitGame() {
    clearInterval(timerInterval);
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    alert(`Game Over! You took ${timeTaken} seconds. Redirecting to High Scores...`);

    fetch('/submit_score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            player_name: playerName,
            score: level,
            time_taken: timeTaken
        })
    })
    .then(response => response.json())
    .then(() => {
        window.location.href = '/highscores';
    })
    .catch(error => {
        console.error("Error submitting score:", error);
    });
}

document.addEventListener('keydown', function(event) {
    cheatSequence += event.key;

    if (cheatSequence.length > Math.max(cheatCode.length, speedCheatCode.length)) {
        cheatSequence = cheatSequence.slice(-Math.max(cheatCode.length, speedCheatCode.length));
    }

    if (cheatSequence.endsWith(cheatCode)) {
        cheatMode = !cheatMode;
        updateCheatDisplay();

        if (!cheatMode) {
            player.x = 1;
            player.y = 1;
            drawMaze();
        }
    }

    if (cheatSequence.endsWith(speedCheatCode)) {
        speedMode = !speedMode;
        updateSpeedDisplay();
    }

    if (event.key === 'q') {
        quitGame();
    }

    if (event.key.startsWith("Arrow")) {
        event.preventDefault();
    }
});

function startMoving(dx, dy) {
    if (!moveInterval) {
        movePlayer(dx, dy);

        moveInterval = setInterval(() => {
            movePlayer(dx, dy);
        }, speedMode ? 20 : 150);
    }
}

function stopMoving() {
    clearInterval(moveInterval);
    moveInterval = null;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') startMoving(0, -1);
    if (event.key === 'ArrowDown') startMoving(0, 1);
    if (event.key === 'ArrowLeft') startMoving(-1, 0);
    if (event.key === 'ArrowRight') startMoving(1, 0);
});

document.addEventListener('keyup', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        stopMoving();
    }
});
