const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let birdY = canvas.height / 2;
let birdX = 50;
let gravity = 2;
let birdVelocity = 0;
let score = 0;
let pipes = [];
let pipeWidth = 40;
let pipeGap = 120;
let pipeSpeed = 2;
let isGameOver = false;

let jumpSound = new Audio('jump.mp3');
let gameOverSound = new Audio('gameover.mp3');
let pointSound = new Audio('point.mp3');

// Load custom bird image
let birdImage = new Image();
birdImage.src = 'bird.png';

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

    // Check if pipe is off-screen
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
      birdY > canvas.height
    ) {
      gameOver();
    }
  });
}

function drawBird() {
  ctx.drawImage(birdImage, birdX - 10, birdY - 10, 20, 20);
}

function gameOver() {
  isGameOver = true;
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('restart-btn').style.display = 'block';
  gameOverSound.play();
  cancelAnimationFrame(animationId);
}

function restartGame() {
  isGameOver = false;
  pipes = [];
  score = 0;
  birdY = canvas.height / 2;
  document.getElementById('score').innerText = `Score: 0`;
  document.getElementById('game-over').style.display = 'none';
  document.getElementById('restart-btn').style.display = 'none';
  animate();
}

function animate() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  birdY += birdVelocity;
  birdVelocity += gravity;

  drawBird();
  drawPipes();

  if (frames % 90 === 0) createPipe();
  frames++;

  animationId = requestAnimationFrame(animate);
}

let frames = 0;
let animationId;
animate();

// Jump on click/tap
document.addEventListener('click', () => {
  if (isGameOver) return;
  birdVelocity = -20;
  jumpSound.play();
});
