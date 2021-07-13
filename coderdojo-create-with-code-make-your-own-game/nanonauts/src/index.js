import background from './images/background.png';
import nanonaut from './images/animatedNanonaut.png';
import bush1 from './images/bush1.png';
import bush2 from './images/bush2.png';

// CONSTANTS
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const NANONAUT_WIDTH = 181;
const NANONAUT_HEIGHT = 229;
const NANONAUT_Y_ACCELERATION = 1;
const NANONAUT_JUMP_SPEED = 20;
const NANONAUT_X_SPEED = 5;

const BACKGROUND_WIDTH = 1000;
const GROUND_Y = 540;

const SPACE_KEYCODE = 32;

const NANONAUT_NR_FRAMES_PER_ROW = 5;
const NANONAUT_NR_ANIMATION_FRAMES = 7;
const NANONAUT_ANIMATION_SPEED = 3;

// SETUP
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

let cameraX = 0;
let cameraY = 0;

let bush1Image = new Image();
bush1Image.src = bush1;

let bush2Image = new Image();
bush2Image.src = bush2;

let bushData = generateBushes();

let backgroundImage = new Image();
backgroundImage.src = background;

let nanonautImage = new Image();
nanonautImage.src = nanonaut;

let nanonautX = CANVAS_WIDTH / 2;
let nanonautY = GROUND_Y - NANONAUT_HEIGHT;
let nanonautYSpeed = 0;
let nanonautIsInAir = false;
let spaceKeyIsPressed = false;
let nanonautFrameNr = 0;
let gameFrameCounter = 0;

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

window.addEventListener('load', start);

function start() {
  window.requestAnimationFrame(mainLoop);
}

function generateBushes() {
  let generatedBushData = [];
  let bushX = 0;
  while (bushX < (2 * CANVAS_WIDTH)) {
    let bushImage;
    if (Math.random() >= 0.5) {
      bushImage = bush1Image;
    } else {
      bushImage = bush2Image;
    }

    generatedBushData.push({
      x: bushX,
      y: 80 + Math.random() * 20,
      image: bushImage
    });
    bushX += 150 + Math.random() * 200;
  }
  return generatedBushData;
}

// MAIN LOOP
function mainLoop() {
  update();
  draw();
  window.requestAnimationFrame(mainLoop);
}

// PLAYER INPUT
function onKeyDown(event) {
  if (event.keyCode === SPACE_KEYCODE) {
    spaceKeyIsPressed = true;
  }
}

function onKeyUp(event) {
  if (event.keyCode === SPACE_KEYCODE) {
    spaceKeyIsPressed = false;
  }
}

// UPDATING
function update() {
  gameFrameCounter = gameFrameCounter + 1;

  // Update Nanonaut.
  if (spaceKeyIsPressed && !nanonautIsInAir) {
    nanonautYSpeed = -NANONAUT_JUMP_SPEED;
    nanonautIsInAir = true;
  }

  nanonautY = nanonautY + nanonautYSpeed;
  nanonautYSpeed = nanonautYSpeed + NANONAUT_Y_ACCELERATION;
  if (nanonautY > (GROUND_Y - NANONAUT_HEIGHT)) {
    nanonautY = GROUND_Y - NANONAUT_HEIGHT;
    nanonautYSpeed = 0;
    nanonautIsInAir = false;
  }

  nanonautX = nanonautX + NANONAUT_X_SPEED;

  // Update camera.
  cameraX = nanonautX - 150;

  // Update Animation.
  if ((gameFrameCounter % NANONAUT_ANIMATION_SPEED) === 0) {
    nanonautFrameNr = nanonautFrameNr + 1;
    if (nanonautFrameNr >= NANONAUT_NR_ANIMATION_FRAMES) {
      nanonautFrameNr = 0;
    }
  }

  // Update bushes.
  for (let i = 0; i < bushData.length ; i++) {
    if ((bushData[i].x - cameraX) < -CANVAS_WIDTH) {
      bushData[i].x += (2 * CANVAS_WIDTH) + 150;
    }
  }
}

// DRAWING
function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw the sky.
  ctx.fillStyle = 'LightSkyBlue';
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);

  // Draw the background.
  let backgroundX = - (cameraX % BACKGROUND_WIDTH);
  ctx.drawImage(backgroundImage, backgroundX, -210);
  ctx.drawImage(backgroundImage, backgroundX + BACKGROUND_WIDTH, -210);

  // Draw the ground.
  ctx.fillStyle = 'ForestGreen';
  ctx.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

  for (let i = 0; i <  bushData.length; i++) {
    ctx.drawImage(bushData[i].image, bushData[i].x - cameraX, GROUND_Y - bushData[i].y - cameraY);
  }

  // Draw the Nanonaut.
  let nanonautSpriteSheetRow = Math.floor(nanonautFrameNr / NANONAUT_NR_FRAMES_PER_ROW);
  let nanonautSpriteSheetColumn = nanonautFrameNr % NANONAUT_NR_FRAMES_PER_ROW;
  let nanonautSpriteSheetX = nanonautSpriteSheetColumn * NANONAUT_WIDTH;
  let nanonautSpriteSheety = nanonautSpriteSheetRow * NANONAUT_HEIGHT;
  ctx.drawImage(nanonautImage, nanonautSpriteSheetX, nanonautSpriteSheety,
    NANONAUT_WIDTH, NANONAUT_HEIGHT, nanonautX - cameraX, nanonautY - cameraY, NANONAUT_WIDTH, NANONAUT_HEIGHT);
}
