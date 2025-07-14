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
let pipeWidth = 40;  // Default pipe width
let pipeGap = 150;   // Increased gap for easier gameplay
let pipeSpeed = 2;
let isGameOver = false;

let jumpSound = new Audio('jump.mp3');
let gameOverSound = new Audio('gameover.mp3');
let pointSound = new Audio('point.mp3');
let backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

function createPipe() {
  const topHeight = Math.random() * (canvas.height / 2);
  const bottomHeight = canvas.height - topHeight - pipeGap;
  pipes.push({ x: canvas.width, topHeight, bottomHeight });
}

function drawPipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    // Draw top pipe
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

    // Draw bottom pipe
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);

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
  ctx.drawImage(birdImage, birdX - 20, birdY - 20, 40, 40);
}

function gameOver() {
  isGameOver = true;
  gameOverSound.play();
  backgroundMusic.pause();
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('restart-btn').style.display = 'block';
  cancelAnimationFrame(animationId);

  // ✅ Trigger popup ad on game over
  if (typeof onGameOver === 'function') {
    onGameOver();
  }
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

  birdVelocity += gravity;
  birdY += birdVelocity;
  drawBird();
  drawPipes();

  if (frames % 90 === 0) createPipe();
  frames++;

  animationId = requestAnimationFrame(animate);
}

let frames = 0;
let animationId;
backgroundMusic.play();
animate();

// Control bird with keyboard and mouse
document.addEventListener('keydown', function (e) {
  if (e.key === ' ') {
    birdVelocity = lift;
    jumpSound.play();
  }
});

document.addEventListener('click', function () {
  birdVelocity = lift;
  jumpSound.play();
});
