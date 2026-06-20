// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('final-score');
const playAgainBtn = document.getElementById('playAgainBtn');

// Game constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game state
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameSpeed = 10;
let gameRunning = false;
let gameLoop;

// Initialize high score display
highScoreElement.textContent = highScore;

// Speed settings
const speedLabels = {
    5: 'Slow',
    10: 'Medium',
    15: 'Fast',
    20: 'Extreme'
};

// Initialize game
function initGame() {
    // Initialize snake
    snake = [
        { x: 10, y: 10 }
    ];
    
    // Initial direction (not moving)
    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: 0 };
    
    // Initial score
    score = 0;
    scoreElement.textContent = score;
    
    // Generate first food
    generateFood();
    
    // Clear canvas
    drawGame();
    
    // Update speed display
    updateSpeedDisplay();
}

// Generate random food position
function generateFood() {
    let newFoodPosition;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFoodPosition = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Check if food would appear on snake
        for (let segment of snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = newFoodPosition;
}

// Draw game elements
function drawGame() {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0d1b2a');
    gradient.addColorStop(1, '#1b263b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        // Snake head
        if (index === 0) {
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            
            // Draw eyes
            ctx.fillStyle = 'white';
            let eyeSize = gridSize / 5;
            
            // Determine eye positions based on direction
            let eyeOffset = gridSize / 3;
            
            // Left eye
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + eyeOffset,
                segment.y * gridSize + eyeOffset,
                eyeSize, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Right eye
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + gridSize - eyeOffset,
                segment.y * gridSize + eyeOffset,
                eyeSize, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Draw tongue if moving
            if (direction.x !== 0 || direction.y !== 0) {
                ctx.fillStyle = '#ff6b6b';
                let tongueLength = gridSize / 2;
                let tongueX = segment.x * gridSize + gridSize / 2;
                let tongueY = segment.y * gridSize + gridSize / 2;
                
                if (direction.x === 1) { // Moving right
                    tongueX += gridSize / 2;
                } else if (direction.x === -1) { // Moving left
                    tongueX -= gridSize / 2;
                } else if (direction.y === 1) { // Moving down
                    tongueY += gridSize / 2;
                } else if (direction.y === -1) { // Moving up
                    tongueY -= gridSize / 2;
                }
                
                ctx.beginPath();
                ctx.arc(tongueX, tongueY, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        } 
        // Snake body
        else {
            // Gradient from head to tail
            let colorValue = 200 - (index * 10);
            colorValue = Math.max(colorValue, 100);
            ctx.fillStyle = `rgb(76, ${colorValue}, 80)`;
            
            // Rounded segments
            let x = segment.x * gridSize;
            let y = segment.y * gridSize;
            let radius = gridSize / 4;
            
            ctx.beginPath();
            ctx.roundRect(x, y, gridSize, gridSize, radius);
            ctx.fill();
        }
    });
    
    // Draw food (apple)
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2,
        0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw apple stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(
        food.x * gridSize + gridSize / 2 - 1,
        food.y * gridSize + gridSize / 4,
        2, gridSize / 4
    );
    
    // Draw leaf
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(
        food.x * gridSize + gridSize / 2 + 5,
        food.y * gridSize + gridSize / 4,
        3, 5, Math.PI / 4, 0, Math.PI * 2
    );
    ctx.fill();
}

// Update game state
function updateGame() {
    if (!gameRunning) return;
    
    // Update direction
    direction = { ...nextDirection };
    
    // Calculate new head position
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Wall collision (wrap around - classic Snake style)
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
    
    // Self collision check
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Food collision
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        scoreElement.textContent = score;
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        // Generate new food
        generateFood();
        
        // Play sound (optional - would need audio file)
        // new Audio('eat.mp3').play();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Redraw game
    drawGame();
}

// Game over function
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Update final score
    finalScoreElement.textContent = score;
    
    // Show game over screen
    gameOverScreen.style.display = 'flex';
    
    // Update button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
}

// Start game function
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        
        // If snake isn't moving, give initial direction
        if (direction.x === 0 && direction.y === 0) {
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
        }
        
        // Start game loop
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, 1000 / gameSpeed);
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        // Hide game over screen if visible
        gameOverScreen.style.display = 'none';
    }
}

// Pause game function
function pauseGame() {
    if (gameRunning) {
        gameRunning = false;
        clearInterval(gameLoop);
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    } else {
        startGame();
    }
}

// Reset game function
function resetGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    gameOverScreen.style.display = 'none';
    initGame();
    
    // Reset button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
}

// Update speed function
function updateSpeed() {
    gameSpeed = parseInt(speedSlider.value);
    updateSpeedDisplay();
    
    // If game is running, restart with new speed
    if (gameRunning) {
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, 1000 / gameSpeed);
    }
}

// Update speed display
function updateSpeedDisplay() {
    speedValue.textContent = speedLabels[gameSpeed] || 'Custom';
}

// Keyboard controls
function handleKeyDown(e) {
    // Prevent default behavior for arrow keys
    if ([37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
    }
    
    // Change direction based on key pressed
    switch (e.keyCode) {
        case 37: // Left arrow
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 38: // Up arrow
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 39: // Right arrow
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
        case 40: // Down arrow
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 32: // Space bar to pause/resume
            if (gameRunning || pauseBtn.textContent.includes('Resume')) {
                pauseGame();
            }
            break;
    }
}

// Mobile touch controls
function initTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        if (!gameRunning) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // Determine swipe direction
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 20 && direction.x !== -1) { // Swipe right
                nextDirection = { x: 1, y: 0 };
            } else if (dx < -20 && direction.x !== 1) { // Swipe left
                nextDirection = { x: -1, y: 0 };
            }
        } else {
            // Vertical swipe
            if (dy > 20 && direction.y !== -1) { // Swipe down
                nextDirection = { x: 0, y: 1 };
            } else if (dy < -20 && direction.y !== 1) { // Swipe up
                nextDirection = { x: 0, y: -1 };
            }
        }
        
        e.preventDefault();
    }, { passive: false });
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
speedSlider.addEventListener('input', updateSpeed);
playAgainBtn.addEventListener('click', () => {
    resetGame();
    startGame();
});

// Keyboard controls
document.addEventListener('keydown', handleKeyDown);

// Initialize touch controls for mobile
initTouchControls();

// Initialize the game
initGame();

// Added rounded rectangle method to canvas context
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        
        return this;
    };
}