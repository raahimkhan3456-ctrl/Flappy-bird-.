const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

// Bird
let bird = { x: 50, y: 150, w: 20, h: 20, gravity: 0.6, lift: -10, velocity: 0 };

// Pipes
let pipes = [];
let frame = 0;
let score = 0;

// Bird jump
document.addEventListener("keydown", () => bird.velocity = bird.lift);
canvas.addEventListener("click", () => bird.velocity = bird.lift);

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
}

function drawPipes() {
  ctx.fillStyle = "green";
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, 40, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, 40, p.bottom);
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();

  if (frame % 90 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let bottom = canvas.height - top - 120;
    pipes.push({ x: canvas.width, top, bottom });
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;
    ctx.fillStyle = "green";
    ctx.fillRect(p.x, 0, 40, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, 40, p.bottom);

    // Collision check
    if (bird.x < p.x + 40 && bird.x + bird.w > p.x &&
       (bird.y < p.top || bird.y + bird.h > canvas.height - p.bottom)) {
      alert("Game Over! Score: " + score);
      document.location.reload();
    }

    if (p.x + 40 < 0) {
      pipes.splice(i, 1);
      score++;
    }
  }

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  frame++;
  requestAnimationFrame(update);
}

update();