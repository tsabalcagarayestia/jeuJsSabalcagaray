// useful to have them as global variables

class Monster {
    constructor(x,y,speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
}
class Player {
    constructor(x,y,xSpeed,ySpeed){
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        //this.xDir = 1;
        //this.yDir = 1;
    }
}
class Bullet {
    constructor(x,y){
        this.x = x;
        this.y = y;
        //this.xSpeed = xSpeed;
        //this.ySpeed = ySpeed;
    }
}

var canvas, ctx, w, h;

var playerSpeed = 2;
var xPlayer = 15;
var yPlayer = 350;
var player = new Player(xPlayer,yPlayer,0,0);

var monsterSpeed = 2;
var nombreMonstre = 2;
var monstersList = [];

var bulletSpeed = 5;
var bullets = [];
var lockFire = false;
var stop = false;

window.onload = init;

var audio_context = window.AudioContext || window.webkitAudioContext;

var con = new audio_context(); 

var osc = con.createOscillator();
var lfo = con.createOscillator();

var lfo_amp = con.createGain();

var collisionMur = false;
var alternate = true;
var animFrameReq;

// -- -- -- -- -- --  General functions -- -- -- -- -- --

function init(){

    canvas = document.querySelector("#myCanvas");

    w = canvas.width; 
    h = canvas.height;  
  
    ctx = canvas.getContext('2d');
  
    createMonsters();

    definitEcouteursClavier();
    setInterval(alternerDessins, 500); // 1000 MS

    // ready to go !
    mainLoop();
}

function loadAudio(){
    console.log("Start Audio");

    lfo_amp.gain.value = 100;

    osc.frequency.value = 300;
    lfo.frequency.value = 2;
    
    lfo.connect(lfo_amp);
    lfo_amp.connect(osc.frequency);
    osc.connect(con.destination);

    osc.start();    
    lfo.start();
}

function mainLoop() {

    if(stop){
        return;
    }
    ctx.clearRect(0, 0, w, h);

    // 1 - draw monsters
    drawMonsters();
    // 2 - move monsters
    moveMonsters();

    // 3 - draw player
    if(player.xSpeed > 0){
        drawPlayer2Left(player.x, player.y);

    } else if(player.xSpeed < 0){
        drawPlayer2Right(player.x, player.y);
    } else {
        drawPlayer2(player.x,player.y);
    }
    // 4 - move player
    movePlayer();

    // 5 - draw bullets
    drawBullets();
    // 6 - move bullets
    moveBullets();

    if(monstersList.length === 0){
        finalText("You win !");
        setTimeout(function(){ document.location.href = "index.html";}, 5000);
        return;
    }
    animFrameReq = requestAnimationFrame(mainLoop);
}

// -- -- -- -- -- --  Player -- -- -- -- -- --

function drawPlayer1(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'black';
    ctx.fillRect(2, 30, 1, 7);
    ctx.fillRect(6, 30, 1, 7);
    ctx.fillRect(19, 30, 1, 7);
    ctx.fillRect(23, 30, 1, 7);
    ctx.fillRect(11, 4 , 4, 1);

    ctx.fillStyle = 'orange';
    ctx.fillRect(3, 30, 3, 7);
    ctx.fillRect(20, 30, 3, 7);
    ctx.fillRect(12, 2 , 2, 2);

    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 25, 26, 7);
    ctx.fillRect(2, 20 , 22, 10);
    ctx.fillRect(5, 15 , 16, 10);
    ctx.fillRect(8, 9 , 10, 10);
    ctx.fillRect(10, 5 , 6, 10);
  
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 17 , 6, 4);
    ctx.fillRect(11, 15 , 4, 6);
  
    ctx.restore();
};

function drawPlayer2(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'black';
    ctx.fillRect(8, 30, 1, 7);
    ctx.fillRect(12, 30, 1, 7);
    ctx.fillRect(25, 30, 1, 7);
    ctx.fillRect(29, 30, 1, 7);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 24, 38, 5);
    ctx.fillRect(5, 25, 28, 7);
    ctx.fillRect(11, 23 , 16, 10);
    ctx.fillRect(14, 20 , 10, 10);
    ctx.fillRect(16, 14 , 6, 10);
    ctx.fillRect(17, 4 , 4, 14);
    ctx.fillRect(18, 2 , 2, 14);

    ctx.fillRect(1, 13, 2, 20);
    ctx.fillRect(35, 13, 2, 20);

    ctx.fillStyle = 'orange';
    ctx.fillRect(9, 30, 3, 7);
    ctx.fillRect(26, 30, 3, 7);

    ctx.fillStyle = 'Crimson'
    ctx.fillRect(18, 6 , 2, 6);
    ctx.fillRect(7, 25 , 2, 2);
    ctx.fillRect(10, 25 , 2, 3);
    ctx.fillRect(13, 25 , 2, 4);
    ctx.fillRect(23, 25 , 2, 4);
    ctx.fillRect(26, 25 , 2, 3);
    ctx.fillRect(29, 25 , 2, 2);

    ctx.fillStyle = 'grey'
    ctx.fillRect(18, 16 , 2, 6);
    ctx.fillRect(1, 12, 2, 2);
    ctx.fillRect(35, 12, 2, 2);
    ctx.restore();
};


function drawPlayer2Left(x, y) {
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(x, y);
  
    ctx.fillStyle = 'black';
    ctx.fillRect(11, 30, 1, 7);
    ctx.fillRect(15, 30, 1, 7);
    ctx.fillRect(21, 30, 1, 7);
    ctx.fillRect(24, 30, 1, 7);

    ctx.fillStyle = 'white';
    ctx.fillRect(4, 24, 30, 6);
    ctx.fillRect(5, 25, 22, 7);
    ctx.fillRect(11, 23 , 13, 10);
    ctx.fillRect(14, 20 , 8, 10);
    ctx.fillRect(16, 14 , 3, 10);
    ctx.fillRect(17, 4 , 3, 14);
    ctx.fillRect(18, 2 , 2, 14);
    
    ctx.fillRect(5, 13, 2, 20);
    ctx.fillRect(31, 13,2, 20);

    ctx.fillStyle = 'orange';
    ctx.fillRect(12, 32, 3, 6);
    ctx.fillRect(22, 32, 2, 6);
  
    ctx.fillStyle = 'Crimson'
    ctx.fillRect(18, 6 , 2, 6);
    ctx.fillRect(10, 25 , 2, 4);
    ctx.fillRect(13, 25 , 2, 5);
    ctx.fillRect(23, 25 , 2, 3);
    ctx.fillRect(26, 25 , 2, 2);
  
    ctx.fillStyle = 'grey'
    ctx.fillRect(18, 16 , 2, 6);
    ctx.fillRect(5, 12, 2, 3);
    ctx.fillRect(31, 12, 2, 2);


    // GOOD practice: restore the context
    ctx.restore();
}

function drawPlayer2Right(x,y){
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'black';
    ctx.fillRect(13, 30, 1, 7);
    ctx.fillRect(16, 30, 1, 7);
    ctx.fillRect(22, 30, 1, 7);
    ctx.fillRect(26, 30, 1, 7);

    ctx.fillStyle = 'white';
    ctx.fillRect(6, 24, 28, 6);
    ctx.fillRect(13, 25, 22, 6);
    ctx.fillRect(14, 23 , 13, 10);
    ctx.fillRect(16, 20 , 8, 10);

    ctx.fillRect(19, 14 , 3, 10);
    ctx.fillRect(18, 4 , 3, 14);
    ctx.fillRect(18, 2 , 2, 14);

    ctx.fillRect(7, 13, 2, 20);
    ctx.fillRect(31, 13, 2, 20);

    ctx.fillStyle = 'orange';
    ctx.fillRect(14, 32, 2, 6);
    ctx.fillRect(23, 32, 3, 6);

    ctx.fillStyle = 'Crimson'
    ctx.fillRect(18, 6 , 2, 6);
    ctx.fillRect(10, 25 , 2, 2);
    ctx.fillRect(13, 25 , 2, 3);
    ctx.fillRect(23, 25 , 2, 4);
    ctx.fillRect(26, 25 , 2, 5);

    ctx.fillStyle = 'grey'
    ctx.fillRect(18, 16 , 2, 6);
    ctx.fillRect(7, 12, 2, 2);
    ctx.fillRect(31, 12, 2, 3);
    ctx.restore();
}


function movePlayer(){
    player.x += player.xSpeed;
    player.y += player.ySpeed;
}

function alternerDessins(){
    alternate = !alternate
}

// -- -- -- -- -- --  Monsters -- -- -- -- -- --

function drawMonsters(){
    for(var i=0; i < monstersList.length; i++) {
        if(alternate){
            drawAMonster1(monstersList[i].x,monstersList[i].y);
        } else {
            drawAMonster2(monstersList[i].x,monstersList[i].y);
        }
    }
}

function drawAMonster1(x, y) {
  
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(x, y);
    ctx.fillStyle = 'grey';
  
    // (0, 0) is the top left corner of the monster.
    // total length : 50;
    ctx.fillRect(10, 10, 30, 20);
    ctx.fillRect(5, 15, 5, 5);
    ctx.fillRect(0, 10, 5, 5);
    ctx.fillRect(40, 15, 5, 5);
    ctx.fillRect(45, 20, 5, 5);


    ctx.fillRect(20, 5, 10, 7);
    ctx.fillRect(30, 30, 5, 5);
    ctx.fillRect(15, 30, 5, 5);

    ctx.fillStyle = 'white';
    ctx.fillRect(15, 15, 5, 5);
    ctx.fillRect(30, 15, 5, 5);
    ctx.fillRect(20, 22, 10, 5);

    // GOOD practice: restore the context
    ctx.restore();
}

function drawAMonster2(x, y) {
  
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(x, y);
    ctx.fillStyle = 'grey';
  
    // (0, 0) is the top left corner of the monster.
    // total length : 50;
    ctx.fillRect(10, 10, 30, 20);
    ctx.fillRect(5, 15, 5, 5);
    ctx.fillRect(0, 20, 5, 5);
    ctx.fillRect(40, 15, 5, 5);
    ctx.fillRect(45, 10, 5, 5);


    ctx.fillRect(20, 5, 10, 7);
    ctx.fillRect(30, 30, 5, 5);
    ctx.fillRect(15, 30, 5, 5);

    ctx.fillStyle = 'white';
    ctx.fillRect(15, 15, 5, 5);
    ctx.fillRect(30, 15, 5, 5);
    ctx.fillRect(20, 22, 10, 5);

    // GOOD practice: restore the context
    ctx.restore();
}


function createMonsters() {
    var monstre1a = new Monster(20,20,monsterSpeed);
    var monstre2a = new Monster(90,20,monsterSpeed);
    var monstre3a = new Monster(160,20,monsterSpeed);
    var monstre4a = new Monster(230,20,monsterSpeed);
    var monstre5a = new Monster(300,20,monsterSpeed);
    var monstre1b = new Monster(20,65,monsterSpeed);
    var monstre2b = new Monster(90,65,monsterSpeed);
    var monstre3b = new Monster(160,65,monsterSpeed);
    var monstre4b = new Monster(230,65,monsterSpeed);
    var monstre5b = new Monster(300,65,monsterSpeed);
    var monstre1c = new Monster(20,110,monsterSpeed);
    var monstre2c = new Monster(90,110,monsterSpeed);
    var monstre3c = new Monster(160,110,monsterSpeed);
    var monstre4c = new Monster(230,110,monsterSpeed);
    var monstre5c = new Monster(300,110,monsterSpeed);

    monstersList.push(monstre1a);
    monstersList.push(monstre2a);
    monstersList.push(monstre3a);
    monstersList.push(monstre4a);
    monstersList.push(monstre5a);
    monstersList.push(monstre1b);
    monstersList.push(monstre2b);
    monstersList.push(monstre3b);
    monstersList.push(monstre4b);
    monstersList.push(monstre5b);
    monstersList.push(monstre1c);
    monstersList.push(monstre2c);
    monstersList.push(monstre3c);
    monstersList.push(monstre4c);
    monstersList.push(monstre5c);
}

function moveMonsters(){
    monstersList.forEach(function(m, index) {
        if(m.x < 0 || (m.x + 50) > w ){
            collisionMur = true;
        }
        testCollisionWithBullets(m,index);
    });
    if(collisionMur){
        uppgradeY();
    }
    monstersList.forEach(function(m, index){
        if(collisionMur){
            m.speed = -m.speed;
        }
        m.x += m.speed * monsterSpeed;
    });

    collisionMur = false;

}

function uppgradeY(){

    monstersList.forEach(function(m, index){
        m.y += 7;
        if( m.y > 300){
            stop = true;
            finalText("You lose !");
            var audio = new Audio('assets/sounds/gameOver.wav');
            audio.play();

            setTimeout(function(){ document.location.href = "index.html";}, 5000);
        }
    });
}

// -- -- -- -- -- -- Bullets -- -- -- -- -- -- --
function drawBullets(){
    for(var i = 0; i < bullets.length; i++){
        
        drawBullet(bullets[i].x,bullets[i].y);
    }
}

function drawBullet(x,y){
    ctx.save();
  
    ctx.translate(x, y);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 2, 15);
    ctx.restore();
}

function moveBullets(){
    for(var i = 0; i < bullets.length; i++){
        bullets[i].y -= bulletSpeed;
    }

}

function addBullet(){
    bullets.push(new Bullet(player.x+18,player.y))
}

function fireBullet(){
    if(!lockFire){
        lockFire = true;
        addBullet();
        var audio = new Audio('assets/sounds/laser.wav');
        audio.play();
        setTimeout(unlockFire,500);
    }
}

function unlockFire(){
    lockFire = false;
}

function testCollisionWithBullets(monster, index) {
    bullets.forEach(bullet => {
        if(rectCollision(monster.x, monster.y,
            bullet.x, bullet.y)) {
            monstersList.splice(index, 1);
            bullets.splice(bullets.indexOf(bullet),1);
            monsterSpeed *= 1.1;
            var audio = new Audio('assets/sounds/explosion.wav');
            audio.play();
        }       
    });
}

function doBulletSound(){
    var context  = new AudioContext();
    // generate the audio buffer from jsfx.js lib
    var buffer    = WebAudiox.getBufferFromJsfx(context, lib);
    var source = context.createBufferSource();
    source.buffer  = buffer;
    source.connect(context.destination);
    source.start(0);
}


// -- -- -- -- -- -- Touches -- -- -- -- -- -- --


function definitEcouteursClavier() {
    window.onkeydown = traiteToucheEnfoncee;
    window.onkeyup = traiteToucheRelachee;
  }

function traiteToucheEnfoncee(event) {
    switch(event.key) {
      case "ArrowRight":
        player.xSpeed = 1 * playerSpeed;
        break;
      case "ArrowLeft":
        player.xSpeed = -1 * playerSpeed;
        break;
      case "ArrowUp":
        player.ySpeed = -1 * playerSpeed;
        break;
      case "ArrowDown":
        player.ySpeed = 1 * playerSpeed;
        break;    
      case " ":
        fireBullet();
        doBulletSound();
        break;
    }
}
    
function traiteToucheRelachee(event) {
    switch(event.key) {
        case "ArrowRight":
          player.xSpeed = 0;
          break;
        case "ArrowLeft":
          player.xSpeed = 0;
          break;
        case "ArrowUp":
          player.ySpeed = 0;
          break;
        case "ArrowDown":
          player.ySpeed = 0;
          break;    
    }  
}






function getARandomColor() {
    var colors = ['red', 'blue', 'cyan', 'purple',
                  'pink', 'green', 'yellow'];
    // a value between 0 and color.length-1
    // Math.round = rounded value
    // Math.random() a value between 0 and 1
    var colorIndex = Math.round((colors.length-1)*Math.random());
    var c = colors[colorIndex];
    // return the random color
    return c;
}

function rectCollision(x0, y0, x1, y1) {
    return !(x1 > x0 + 50 || 
        x1 + 5 < x0 || 
        y1 > y0 + 35 ||
        y1 + 15 < y0);
}

function finalText(text){

    ctx.save();
    ctx.fillStyle = "white"
    ctx.font = "50px Arial";
    ctx.fillText(text, 200, 150);
    ctx.fillStyle = "white"
    ctx.font = "20px Arial";
    ctx.fillText("Return to main menu.", 200, 190);
    ctx.restore();
}