import background from './images/background.png';
import nanonaut from './images/nanonaut.png';

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

// SETUP
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

let cameraX = 0;
let cameraY = 0;

let backgroundImage = new Image();
backgroundImage.src = background;

let nanonautImage = new Image();
nanonautImage.src = nanonaut;

let nanonautX = CANVAS_WIDTH / 2;
let nanonautY = GROUND_Y - NANONAUT_HEIGHT;
let nanonautYSpeed = 0;
let nanonautIsInAir = false;
let spaceKeyIsPressed = false;

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

window.addEventListener('load', start);

function start() {
  window.requestAnimationFrame(mainLoop);
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
  nanonautX = nanonautX + NANONAUT_X_SPEED;
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

  // Update camera
  cameraX = nanonautX - 150;
}

// DRAWING
function draw() {
  // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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

  ctx.drawImage(nanonautImage, nanonautX - cameraX, nanonautY - cameraY);
}
