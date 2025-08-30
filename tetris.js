const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 14;  // cell including gap
const blockSize = 10; // block size inside cell
const columns = 53;   // GitHub graph width
const rows = 7;       // GitHub graph rows
canvas.width = columns * cellSize;
canvas.height = rows * cellSize;

const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

let settled = Array.from({ length: rows }, () => Array(columns).fill(null));
let fallingBlocks = [];
let clearingRows = []; // rows currently being cleared

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

  ctx.fillStyle = "#1d2228"; // faint grey for empty cells
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

function startRowClearAnimation(row) {
  clearingRows.push({
    y: row,
    progress: 0
  });
}

function processClearingRows() {
  for (let i = 0; i < clearingRows.length; i++) {
    const row = clearingRows[i];
    const step = Math.floor(row.progress);

    if (step < columns) {
      settled[row.y][step] = null;
      row.progress += 0.5; // animation speed
    } else {
      for (let yy = row.y; yy > 0; yy--) {
        settled[yy] = [...settled[yy - 1]];
      }
      settled[0] = Array(columns).fill(null);
      clearingRows.splice(i, 1);
      i--;
    }
  }
}

function detectFullRows() {
  for (let y = rows - 1; y >= 0; y--) {
    if (settled[y].every(cell => cell !== null) &&
        !clearingRows.find(r => r.y === y)) {
      startRowClearAnimation(y);
    }
  }
}

function update() {
  drawGrid();

  // Draw settled blocks
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (settled[y][x]) {
        drawBlock(x, y, settled[y][x]);
      }
    }
  }

  // Update falling blocks
  fallingBlocks.forEach(block => {
    block.y += 0.1; // speed
    const gridY = Math.floor(block.y);

    if (gridY >= rows - 1 || settled[gridY + 1][block.x]) {
      settled[gridY][block.x] = block.color;
      block.settled = true;
    }

    drawBlock(block.x, Math.floor(block.y), block.color);
  });

  fallingBlocks = fallingBlocks.filter(b => !b.settled);

  if (Math.random() < 0.15) {
    fallingBlocks.push(createBlock());
  }

  processClearingRows();
  detectFullRows();

  requestAnimationFrame(update);
}

update();
