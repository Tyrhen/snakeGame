//Steps
//(1) make grid #complete
//(2) make snake #complete
//(3) collision detection #complete
//(4) spawning food + growing snake #complete

// settings/init values
const gameInterval = setInterval(() => {
  step();
  console.log("runnign");
}, 80);
const canvas = document.getElementById("canvas");
const rows = 20;
const cols = 30;
const pixel = 10;
const gridKeys = new Map();
const foodKeys = new Map();
const snakePos = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
];
let score = 0;

//paint
function createCanvas() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let tile = document.createElement("div");
      tile.setAttribute("id", "tile");
      tile.style.left = j * pixel + "px";
      tile.style.top = i * pixel + "px";
      canvas.appendChild(tile);
      let positionKey = `${i}_${j}`;
      gridKeys.set(positionKey, tile);
    }
  }
}

function drawSnake(snake) {
  const snakeKeys = new Set();

  snake.map((pair) => {
    let pos = toKeys(pair);
    snakeKeys.add(pos);
    return pos;
  });

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let positionKey = `${i}_${j}`;
      let pixel = gridKeys.get(positionKey);

      if (snakeKeys.has(positionKey)) {
        pixel.style.background = "green";
      } else if (foodKeys.has(positionKey)) {
        continue;
      } else {
        pixel.style.background = "white";
      }

      canvas.appendChild(pixel);
    }
  }
}

function drawFood(snake) {
  const snakeKeys = new Set();

  snake.map((pair) => {
    let pos = toKeys(pair);
    snakeKeys.add(pos);
    return pos;
  });

  let foundUniquePos = false;

  while (foundUniquePos === false) {
    let rowPos = Math.floor(Math.random() * rows);
    let colPos = Math.floor(Math.random() * cols);
    let foodKey = toKeys([rowPos, colPos]);
    if (!snakeKeys.has(foodKey)) {
      foundUniquePos = true;
      foodPixel = gridKeys.get(foodKey);
      foodKeys.set(foodKey, foodPixel);
      foodPixel.style.background = "orange";
    }
  }
}

//movement
const moveLeft = ([r, c]) => {
  return [r, c - 1];
};
const moveRight = ([r, c]) => {
  return [r, c + 1];
};
const moveDown = ([r, c]) => {
  return [r + 1, c];
};
const moveUp = ([r, c]) => {
  return [r - 1, c];
};
let currentDirection = moveRight;

window.addEventListener("keydown", function (event) {
  if (
    ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
      event.code
    ) > -1
  ) {
    event.preventDefault();
  }
  const key = event.key;
  switch (key) {
    case "ArrowLeft":
      if (currentDirection !== moveRight) {
        currentDirection = moveLeft;
      }

      break;
    case "ArrowRight":
      if (currentDirection !== moveLeft) {
        currentDirection = moveRight;
      }

      break;
    case "ArrowUp":
      if (currentDirection !== moveDown) {
        currentDirection = moveUp;
      }
      break;
    case "ArrowDown":
      if (currentDirection !== moveUp) {
        currentDirection = moveDown;
      }
      break;
    case "r":
      restartGame();
      break;
    case "R":
      restartGame();
      break;
  }
});

function step() {
  let head = snakePos[snakePos.length - 1];
  let futurePos = currentDirection(head);
  let collisionDetected = outOfBoundsDetection(futurePos);
  if (collisionDetected) {
    return stopGame(head);
  }
  snakePos.push(futurePos);
  if (snakeOnFoodDetection(futurePos)) {
    drawFood(snakePos);
  } else {
    snakePos.shift();
  }
  drawSnake(snakePos);
}

//Game states
function startGame() {
  createCanvas();
  drawSnake(snakePos);
  drawFood(snakePos);
}

function stopGame([i, j]) {
  canvas.style.border = "5px solid red";
  let positionKey = toKeys([i, j]);
  let head = gridKeys.get(positionKey);
  head.style.background = "purple";
  return clearInterval(gameInterval);
}

function restartGame() {
  setTimeout(function () {
    location.reload(true);
  }, 100);
}

// detections+collisions
function outOfBoundsDetection(head) {
  if (head[0] < 0 || head[1] < 0) {
    return true;
  }
  if (head[0] > rows - 1 || head[1] > cols - 1) {
    return true;
  }
  if (bodyCollision(snakePos, head)) {
    return true;
  }
  return false;
}

function bodyCollision(snake, head) {
  let bodyKeys = snake.map((pos) => toKeys(pos));
  let headKeys = toKeys(head);
  if (bodyKeys.includes(headKeys)) {
    return true;
  }
  return false;
}

function snakeOnFoodDetection(head) {
  let posKey = toKeys([head[0], head[1]]);
  if (foodKeys.has(posKey)) {
    score += 1;
    document.getElementById("score").innerText = `score: ${score}`;
    foodKeys.delete(posKey);
    return true;
  }
  return false;
}

//helpers
function toKeys(array) {
  return `${array[0]}_${array[1]}`;
}

//Lets Play!
startGame();
