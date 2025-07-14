const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

const birdImage = new Image();
birdImage.src = 'bird.png'; // Path to custom bird image

let birdY = canvas.height / 2;
let birdX = 50;
let gravity = 0.1;  // Slower gravity for gentle falling
let lift = -4;      // Slower jump
let birdVelocity = 0;
let score = 0;
let pipes = [];
let pipeWidth = 40;  // Default pipe width (kept as original)
let pipeGap = 150;   // Increased gap between pipes for easier gameplay
let pipeSpeed = 2;   // Original pipe speed for normal movement
let isGameOver = false;

let jumpSound = new Audio('jump.mp3');
let gameOverSound = new Audio('gameover.mp3');
let pointSound = new Audio('point.mp3');
let backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;  // Loop the background music
backgroundMusic.volume = 0.2;  // Lower volume for background music

function createPipe() {
  const topHeight = Math.random() * (canvas.height / 2);
  const bottomHeight = canvas.height - topHeight - pipeGap;
  pipes.push({ x: canvas.width, topHeight, bottomHeight });
}

function drawPipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed; // Move pipes to the left

    // Draw top pipe with straight edges
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

    // Draw bottom pipe with straight edges
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);

    // Remove pipe if it's off-screen
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
      document.getElementById('score').innerText = `Score: ${score}`;
      pointSound.play();
    }

    // Collision detection
    if (
      (birdX + 20 > pipe.x && birdX < pipe.x + pipeWidth &&
        (birdY < pipe.topHeight || birdY > canvas.height - pipe.bottomHeight)) ||
      birdY > canvas.height || birdY < 0
    ) {
      gameOver();
    }
  });
}

function drawBird() {
  ctx.drawImage(birdImage, birdX - 20, birdY - 20, 40, 40); // Draw custom bird image
}

function gameOver() {
  isGameOver = true;
  gameOverSound.play();
  backgroundMusic.pause();
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('restart-btn').style.display = 'block';
  cancelAnimationFrame(animationId);
}

function restartGame() {
  isGameOver = false;
  pipes = [];
  score = 0;
  birdY = canvas.height / 2;
  birdVelocity = 0;
  backgroundMusic.play();
  document.getElementById('score').innerText = `Score: 0`;
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('restart-btn').style.display = 'none';
  animate();
}

function animate() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  birdVelocity += gravity; // Apply gravity
  birdY += birdVelocity; // Update bird position
  drawBird();
  drawPipes();

  if (frames % 90 === 0) createPipe(); // Pipes appear every 90 frames
  frames++;

  animationId = requestAnimationFrame(animate);
}

let frames = 0;
let animationId;
backgroundMusic.play();
animate();

// Control bird
document.addEventListener('keydown', function (e) {
  if (e.key === ' ') {
    birdVelocity = lift; // Make the bird jump when space is pressed
    jumpSound.play();
  }
});

document.addEventListener('click', function () {
  birdVelocity = lift; // Make the bird jump when clicked
  jumpSound.play();
});
