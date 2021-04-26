import nanonaut from './nanonaut.png';

// CONSTANTS
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 600;
let NANONAUT_WIDTH = 181;
let NANONAUT_HEIGHT = 229;
let GROUND_Y = 540;

// SETUP
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

let nanonautImage = new Image();
nanonautImage.src = nanonaut;

let nanonautX = 50;
let nanonautY = 40;

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
// UPDATING
function update() { }

// DRAWING
function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.drawImage(nanonautImage, nanonautX, nanonautY);
}
