import background from './images/background.png';
import nanonaut from './images/nanonaut.png';

// CONSTANTS
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 600;
let NANONAUT_WIDTH = 181;
let NANONAUT_HEIGHT = 229;
let NANONAUT_Y_ACCELERATION = 1;
let GROUND_Y = 540;
let NANONAUT_JUMP_SPEED = 20;

let SPACE_KEYCODE = 32;

// SETUP
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

let backgroundImage = new Image();
backgroundImage.src = background;

let nanonautImage = new Image();
nanonautImage.src = nanonaut;

let nanonautX = 50;
let nanonautY = 40;
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
}

// DRAWING
function draw() {
  // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw the sky.
  ctx.fillStyle = 'LightSkyBlue';
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y - 40);

  // Draw the background.
  ctx.drawImage(backgroundImage, 0, -210);

  // Draw the ground.
  ctx.fillStyle = 'ForestGreen';
  ctx.fillRect(0, GROUND_Y - 40, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y + 40);

  ctx.drawImage(nanonautImage, nanonautX, nanonautY);
}
