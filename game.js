const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

// Bird properties
let bird = {
  x: 50,
  y: 150,
  w: 25,
  h: 25,
  gravity: 0.5,
  lift: -8,
  velocity: 0
};

// Pipes
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Bird control (jump)
function flap() {
  if (!gameOver) {
    bird.velocity = bird.lift;
  } else {
    restartGame();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") flap();
});
canvas.addEventListener("click", flap);

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.w / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "green";
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, 40, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, 40, p.bottom);
  }
}

function restartGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  update();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Pipes logic
    if (frame % 90 === 0) {
      let top = Math.random() * (canvas.height / 2);
      let gap = 120;
      let bottom = canvas.height - top - gap;
      pipes.push({ x: canvas.width, top, bottom });
    }

    for (let i = 0; i < pipes.length; i++) {
      let p = pipes[i];
      p.x -= 2;

      // Collision check
      if (
        bird.x < p.x + 40 &&
        bird.x + bird.w > p.x &&
        (bird.y < p.top || bird.y + bird.h > canvas.height - p.bottom)
      ) {
        gameOver = true;
      }

      if (p.x + 40 < 0) {
        pipes.splice(i, 1);
        score++;
      }
    }

    drawPipes();
    drawBird();

    // Ground / Ceiling check
    if (bird.y + bird.h > canvas.height || bird.y < 0) {
      gameOver = true;
    }

    // Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);

    frame++;
    requestAnimationFrame(update);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2 - 20);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Click or press SPACE to Restart", canvas.width / 2 - 120, canvas.height / 2 + 20);
  }
}

update();
