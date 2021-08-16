import background from './images/background.png';
import nanonaut from './images/animatedNanonaut.png';
import robot from './images/animatedRobot.png';
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

const ROBOT_WIDTH = 141;
const ROBOT_HEIGHT = 139;
const ROBOT_X_SPEED = 4;

const BACKGROUND_WIDTH = 1000;
const GROUND_Y = 540;

const SPACE_KEYCODE = 32;

const NANONAUT_NR_ANIMATION_FRAMES = 7;
const NANONAUT_ANIMATION_SPEED = 3;
const ROBOT_NR_ANIMATION_FRAMES = 9;
const ROBOT_ANIMATION_SPEED = 5;

const MIN_DISTANCE_BETWEEN_ROBOTS = 400;
const MAX_DISTANCE_BETWEEN_ROBOTS = 1200;
const MAX_ACTIVE_ROBOTS = 3;

// SETUP
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

let cameraX = 0;
let cameraY = 0;

const bush1Image = new Image();
bush1Image.src = bush1;

const bush2Image = new Image();
bush2Image.src = bush2;

const bushData = generateBushes();

const backgroundImage = new Image();
backgroundImage.src = background;

const nanonautImage = new Image();
nanonautImage.src = nanonaut;

let nanonautSpriteSheet = {
  nrFramesPerRow: 5,
  spriteWidth: NANONAUT_WIDTH,
  spriteHeight: NANONAUT_HEIGHT,
  image: nanonautImage
}

const robotImage = new Image();
robotImage.src = robot;

let robotSpriteSheet = {
  nrFramesPerRow: 3,
  spriteWidth: ROBOT_WIDTH,
  spriteHeight: ROBOT_HEIGHT,
  image: robotImage
};

let robotData = [];

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

  // Update Animation.
  if ((gameFrameCounter % NANONAUT_ANIMATION_SPEED) === 0) {
    nanonautFrameNr = nanonautFrameNr + 1;
    if (nanonautFrameNr >= NANONAUT_NR_ANIMATION_FRAMES) {
      nanonautFrameNr = 0;
    }
  }

  // Update camera.
  cameraX = nanonautX - 150;

  // Update bushes.
  for (let i = 0; i < bushData.length; i++) {
    if ((bushData[i].x - cameraX) < -CANVAS_WIDTH) {
      bushData[i].x += (2 * CANVAS_WIDTH) + 150;
    }
  }
  // Update robots.
  updateRobots();
}

function updateRobots() {
  // Move and animate robots.
  for (let i = 0; i < robotData.length; i++) {
    robotData[i].x -= ROBOT_X_SPEED;
    if ((gameFrameCounter % ROBOT_ANIMATION_SPEED) === 0) {
      robotData[i].frameNr = robotData[i].frameNr + 1;
      if (robotData[i].frameNr >= ROBOT_NR_ANIMATION_FRAMES) {
        robotData[i].frameNr = 0;
      }
    }
  }

  // Remove robots that have gone off-screen
  let robotIndex = 0;
  while (robotIndex < robotData.length) {
    if (robotData[robotIndex].x < cameraX - ROBOT_WIDTH) {
      robotData.splice(robotIndex, 1);
    } else {
      robotIndex += 1;
    }
  }

  if (robotData.length < MAX_ACTIVE_ROBOTS) {
    let lastRobotX = CANVAS_WIDTH;
    if (robotData.length > 0) {
      lastRobotX = robotData[robotData.length - 1].x;
    }
    let newRobotX = lastRobotX + MIN_DISTANCE_BETWEEN_ROBOTS + Math.random() * (MAX_DISTANCE_BETWEEN_ROBOTS - MIN_DISTANCE_BETWEEN_ROBOTS);
    robotData.push({
      x: newRobotX,
      y: GROUND_Y - ROBOT_HEIGHT,
      frameNr: 0
    });
  }
}

function doesNanonautoverlapRobotAlongOneAxis(nanonautNearX, nanonautFarX, robotNearX, robotFarX) {
  let nanonautOverlapsNearRobotEdge = (nanonautFarX >= robotNearX) && (nanonautFarX <= robotFarX);
  let nanonautOverlapsFarRobotEdge = (nanonautNearX >= robotNearX) && (nanonautNearX <= robotFarX);
  let nanonautOverlapsEntireRobot = (nanonautNearX <= robotNearX) && (nanonautFarX >= robotFarX);
  return nanonautOverlapsNearRobotEdge || nanonautOverlapsFarRobotEdge || nanonautOverlapsEntireRobot;
}

function doesNanonautoverlapRobot(nanonautX, nanonautY, nanonautWidth, nanonautHeight, robotX, robotY, robotWidth, robotHeight) {
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

  // Draw the bushes.
  for (let i = 0; i < bushData.length; i++) {
    ctx.drawImage(bushData[i].image, bushData[i].x - cameraX, GROUND_Y - bushData[i].y - cameraY);
  }

  // Draw the robots.
  for (let i = 0; i < robotData.length; i++) {
    drawAnimatedSprite(robotData[i].x - cameraX, robotData[i].y - cameraY, robotData[i].frameNr, robotSpriteSheet);
  }

  // Draw the Nanonaut.
  drawAnimatedSprite(nanonautX - cameraX, nanonautY - cameraY, nanonautFrameNr, nanonautSpriteSheet);
}

function drawAnimatedSprite(screenX, screenY, frameNr, spriteSheet) {
  let spriteSheetRow = Math.floor(frameNr / spriteSheet.nrFramesPerRow);
  let spriteSheetColumn = frameNr % spriteSheet.nrFramesPerRow;
  let spriteSheetX = spriteSheetColumn * spriteSheet.spriteWidth;
  let spriteSheetY = spriteSheetRow * spriteSheet.spriteHeight;
  ctx.drawImage(
    spriteSheet.image, spriteSheetX, spriteSheetY,
    spriteSheet.spriteWidth, spriteSheet.spriteHeight, screenX, screenY,
    spriteSheet.spriteWidth, spriteSheet.spriteHeight);
}
