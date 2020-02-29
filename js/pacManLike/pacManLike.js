
class Level{
  constructor(coins,enemies){
    this.coins = coins;
    this.enemies = enemies;
  }
}
var canvas, ctx, w, h; 
var mousePos;

// an empty array!
var coins = []; 
var enemies = [];

var currentLevel;
const levels = [new Level(10,1),
  new Level(10,2),
  new Level(10,3),
  new Level(10,4),
  new Level(10,5),
  new Level(10,6),
  new Level(10,7),
  new Level(10,8)]

var player = {
  x:10,
  y:10,
  width:40,
  height:40,
}
var lock = false;
var gameOver = false;

window.onload = function init() {
  
    canvas = document.querySelector("#myCanvas");
    currentLevel = 0;
  
    // often useful
    w = canvas.width; 
    h = canvas.height;  
  
    ctx = canvas.getContext('2d');
  
    coins = createCoins(10);
    enemies = createEnemies(1);

    canvas.addEventListener('mousemove', mouseMoved);

    requestAnimationFrame(mainLoop);
}

function loadMusic(){

}

function nextLevel(){
  if(currentLevel === 7){
    currentLevel = -1;
  }
  currentLevel++
  coins = createCoins(levels[currentLevel].coins);
  enemies = createEnemies(levels[currentLevel].enemies);
  lock = false;

  
}

function mouseMoved(evt) {
    mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
    // necessary work in the canvas coordinate system
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX-15 - rect.left,
        y: evt.clientY-15 - rect.top
    };
}

function movePlayerWithMouse() {
  if(mousePos !== undefined) {
    player.x = mousePos.x;
    player.y = mousePos.y;
  }
}

function mainLoop() {
  // 1 - clear the canvas
  if(gameOver){
    gameOverText();
    var audio = new Audio('assets/sounds/gameOver.wav');
    audio.play();
    return;
  }
  ctx.clearRect(0, 0, w, h);
  
  // draw the ball and the player
  drawPlayer(player);
  drawAllCoins(coins);
  drawAllEnemies(enemies);
  drawNumberOfCoinsAlive(coins);
  drawLevel();

  // animate the ball that is bouncing all over the walls
  moveCoinsAndEnemies(coins,enemies);
  
  movePlayerWithMouse();
  
  // ask for a new animation frame
  requestAnimationFrame(mainLoop);
}


function createCoins(n) {
  var coinArray = [];
  
  for(var i=0; i < n; i++) {
     var c = {
        x:w/2,
        y:h/2,
        radius: 10 + 10 * Math.random(), 
        speedX: -4 + 8 * Math.random(), 
        speedY: -4 + 8 * Math.random(), 
      }
     coinArray.push(c);
    }
  return coinArray;
}

function createEnemies(n){
    var enemyArray = [];
  
  for(var i=0; i < n; i++) {
     var e = {
        x:w/2,
        y:h/2,
        radius: 10 + 10 * Math.random(), 
        speedX: -2 + 4 * Math.random(), 
        speedY: -2 + 4 * Math.random(), 
      }
     enemyArray.push(e);
    }
  return enemyArray;
}

function drawNumberOfCoinsAlive(coins) {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.font="34px Arial";
  
  if(coins.length === 0) {
    ctx.fillText("YOU WIN this stage!", 150, 160);
    ctx.fillText("Hide you in a corner", 150, 220);
    ctx.fillText("and wait the next level...", 130, 250);

    if(!lock){
      lock = true;
      setTimeout(function() { nextLevel();}, 2000);
    }
  } else {
    ctx.fillText(coins.length, 20, 30);
  }
  ctx.restore();
}

function gameOverText(){
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.font="34px Arial";
  
  ctx.fillText("Game Oveeerrr!", 160, 160);

  ctx.restore();
}

function drawLevel() {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.font="30px Arial";
  var level = currentLevel + 1;
    ctx.fillText("Level: "+ level, w-130, 30);
  ctx.restore();
}

function drawAllCoins(coinArray) {
    coinArray.forEach(function(c) {
      drawCoin(c);
    });
}
function drawAllEnemies(enemiesArray) {
  enemiesArray.forEach(function(c) {
    drawEnemies(c);
  });
}

function moveCoinsAndEnemies(coinArray,enemiesArray) {
  // iterate on all balls in array
  coinArray.forEach(function(c, index) {
      // b is the current ball in the array
      c.x += c.speedX;
      c.y += c.speedY;
  
      testCollisionWithWalls(c); 
      testCollisionWithCoinsPlayer(c, index);
  });
  enemiesArray.forEach(function(c, index) {
    // b is the current ball in the array
    c.x += c.speedX;
    c.y += c.speedY;

    testCollisionWithWalls(c); 
    testCollisionWithEnemiesPlayer(c, index);
});
}

function testCollisionWithCoinsPlayer(c, index) {
  if(circRectsOverlap(player.x, player.y,
                     player.width, player.height,
                     c.x,c.y, c.radius)) {
    coins.splice(index, 1);
    var audio = new Audio('assets/sounds/coin.wav');
    audio.play();
  }
}
function testCollisionWithEnemiesPlayer(e, index) {
  if(circRectsOverlap(player.x, player.y,
                     player.width, player.height,
                     e.x,e.y, e.radius)) {
    enemies.splice(index, 1);
    gameOver = true;
  }
}


function testCollisionWithWalls(b) {
    // COLLISION WITH VERTICAL WALLS ?
    if((b.x + b.radius) > w) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedX = -b.speedX;
    
    // put the ball at the collision point
    b.x = w - b.radius;
  } else if((b.x -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedX = -b.speedX;
    
    // put the ball at the collision point
    b.x = b.radius;
  }
  
  // COLLISIONS WTH HORIZONTAL WALLS ?
  // Not in the else as the ball can touch both
  // vertical and horizontal walls in corners
  if((b.y + b.radius) > h) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedY = -b.speedY;
    
    // put the ball at the collision point
    b.y = h - b.radius;
  } else if((b.y -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedY = -b.speedY;
    
    // put the ball at the collision point
    b.Y = b.radius;
  }  
}

function drawPlayer(r) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(r.x, r.y);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(20, 20, 12, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = '#C3BDBB';
    ctx.beginPath();
    ctx.arc(20, 20, 10, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(20, 20, 6, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = '#C3BDBB';
    ctx.beginPath();
    ctx.arc(20,20, 4, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle="black";
    ctx.fillRect(4, 18, 10, 4);
    ctx.fillRect(26, 18, 10, 4);
    ctx.fillRect(18, 10, 4, 5);
    ctx.fillRect(18, 25, 4, 5);
    ctx.fillRect(0, 0, 4, 40);
    ctx.fillRect(36, 0, 4, 40);
  
    ctx.fillRect(2, -2, 4, 4);
    ctx.fillRect(2, 38, 4, 4);
    ctx.fillRect(34, -2, 4, 4);
    ctx.fillRect(34, 38, 4, 4);
  
    ctx.fillStyle = '#A39F9E';
    ctx.fillRect(-2, 0, 2, 40);
    ctx.fillRect(40, 0, 2, 40);
    ctx.fillStyle="black";
    ctx.fillRect(-2, 10, 2, 7);
    ctx.fillRect(40, 10, 2, 7);
    ctx.fillRect(-2, 23, 2, 7);
    ctx.fillRect(40, 23, 2, 7);
  // bonne pratique
    ctx.restore();
}

function drawCoin(c) {
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(c.x, c.y);
  
    ctx.fillStyle = 'yellow';
    // (0, 0) is the top left corner of the monster.
    ctx.beginPath();
    ctx.arc(0, 0, c.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    // (0, 0) is the top left corner of the monster.
    ctx.beginPath();
    ctx.arc(0, 0, c.radius/3, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = 'yellow';
    // (0, 0) is the top left corner of the monster.
    ctx.beginPath();
    ctx.arc(0, 0, c.radius/5, 0, 2*Math.PI);
    ctx.fill();
 
    // GOOD practice: restore the context
    ctx.restore();
}

function drawEnemies(e){
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(0, 0, e.radius, 0, 2*Math.PI);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = '20px serif';
  ctx.fillText('X', -7, 7);

  // GOOD practice: restore the context
  ctx.restore();
}


function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
   var testX=cx;
   var testY=cy;
   if (testX < x0) testX=x0;
   if (testX > (x0+w0)) testX=(x0+w0);
   if (testY < y0) testY=y0;
   if (testY > (y0+h0)) testY=(y0+h0);
   return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
}