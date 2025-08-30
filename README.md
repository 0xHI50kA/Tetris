<h1 align="center" style="color:#0ff; font-family: 'Courier New', monospace;">
🎮 Tetris-Style GitHub Contributions
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Mode-Cyberpunk-%23ff00ff?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/Commits-Falling%20Blocks-%2300ffff?style=for-the-badge" />
</p>

---

> **"Hack your commits into a futuristic grid."**

This project transforms your **GitHub contributions** into a **Tetris-inspired, interactive neon experience**.  
Watch your commits fall like glowing blocks, stack them, and **build your cyberpunk-style contribution skyline!**

---

### 🚀 Features
- Neon-lit **Tetris-like contribution board**
- Interactive and visually striking design
- Perfect for your GitHub README or portfolio

---

<p align="center" style="font-size:14px;color:#ff00ff;">
⚡ *Stack. Glow. Commit.* ⚡
</p>




<div align="center">
  <canvas id="tetrisCanvas"></canvas>
</div>

<script>
const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 14;
const blockSize = 10;
const columns = 53;
const rows = 7;
canvas.width = columns * cellSize;
canvas.height = rows * cellSize;

const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

let settled = Array.from({ length: rows }, () => Array(columns).fill(null));
let fallingBlocks = [];

function createBlock() {
  return {
    x: Math.floor(Math.random() * columns),
    y: 0,
    color: colors[Math.floor(Math.random() * (colors.length - 1)) + 1]
  };
}

function drawGrid() {
  ctx.fillStyle = "#161b22";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1d2228";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      ctx.fillRect(
        x * cellSize + (cellSize - blockSize) / 2,
        y * cellSize + (cellSize - blockSize) / 2,
        blockSize,
        blockSize
      );
    }
  }
}

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    x * cellSize + (cellSize - blockSize) / 2,
    y * cellSize + (cellSize - blockSize) / 2,
    blockSize,
    blockSize
  );
}

function popAnimation(progress) {
  const rowsToClear = Math.floor(progress * rows);
  for (let y = 0; y < rowsToClear; y++) {
    settled[y] = Array(columns).fill(null);
  }
}

let startTime = null;
const loopDuration = 30 * 1000;
const buildDuration = 25 * 1000;
const popDuration = loopDuration - buildDuration;
const totalCells = rows * columns;

function update(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  drawGrid();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (settled[y][x]) drawBlock(x, y, settled[y][x]);
    }
  }

  if (elapsed < buildDuration) {
    fallingBlocks.forEach(block => {
      const remainingTime = buildDuration - elapsed;
      const cellsLeft = totalCells - settled.flat().filter(c => c !== null).length;
      const speed = Math.max(0.1, cellsLeft / remainingTime * 0.1 * 100);
      block.y += speed;
      const gridY = Math.floor(block.y);
      if (gridY >= rows - 1 || settled[gridY + 1][block.x]) {
        settled[gridY][block.x] = block.color;
        block.settled = true;
      }
      drawBlock(block.x, Math.floor(block.y), block.color);
    });

    fallingBlocks = fallingBlocks.filter(b => !b.settled);
    const emptyCells = totalCells - settled.flat().filter(c => c !== null).length;
    const spawnChance = Math.min(0.2, emptyCells / totalCells);
    if (Math.random() < spawnChance) fallingBlocks.push(createBlock());

  } else {
    const popElapsed = elapsed - buildDuration;
    const progress = Math.min(popElapsed / popDuration, 1);
    popAnimation(progress);
  }

  if (elapsed < loopDuration) {
    requestAnimationFrame(update);
  } else {
    settled = Array.from({ length: rows }, () => Array(columns).fill(null));
    fallingBlocks = [];
    startTime = null;
    requestAnimationFrame(update);
  }
}

requestAnimationFrame(update);
</script>
