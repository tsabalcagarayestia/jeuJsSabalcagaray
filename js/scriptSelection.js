window.onload = init;

class Star{
    constructor(x,y,dx,dy,width){
        this.initX = x;
        this.initY = y;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
    }
}

// -- -- -- -- -- -- Attributes -- -- -- -- -- -- 

var canvas, ctx, w, h;
var jeu;

var stars = [new Star(0,0,6,4,1), new Star(200,0,6,4,2),new Star(0,100,6,4,1),
    new Star(0,0,6,4,1), new Star(200,0,6,4,2),new Star(500,0,6,4,3),
    new Star(300,0,6,4,1), new Star(350,0,6,4,2),new Star(0,130,6,4,1),
    new Star(0,200,6,4,3), new Star(500,0,6,4,2),new Star(0,330,6,4,1),
    new Star(0,280,6,4,1), new Star(200,250,6,4,2),new Star(0,90,6,4,1),
    new Star(70,0,12,8,4), new Star(0,40,9,6,2),new Star(0,60,6,4,1)]


// -- -- -- -- -- -- General functions -- -- -- -- -- --

function init(){
    console.log("charger");
    
    canvas = document.querySelector("#myCanvas");
    canvas.addEventListener('click', gameSelect,false);

    w = canvas.width; 
    h = canvas.height;  
  
    ctx = canvas.getContext('2d');
    writeGames();

    document.addEventListener('click',loadMusic)

    requestAnimationFrame(mainLoop);
}

function loadMusic(){
    var audio = new Audio('assets/sounds/menu.mp3');
    audio.play();
    setInterval(function(){
        var audio = new Audio('assets/sounds/menu.mp3');
        audio.play();
    },16027);
}

function writeGames(){
    ctx.save();

    ctx.fillStyle = "white"
    ctx.font = "38px Calibri";
    ctx.fillText("Select your game :", 140, 140);
    ctx.font = "26px Calibri";
    ctx.fillText("O - Pac Space Man - O", 160, 200);
    ctx.fillText("*-_Space invaders_-*", 160, 240);
    ctx.restore();
}


function gameSelect(event){

    if(event.x > 170 && event.x < 400 && event.y > 195 && event.y < 215){
        console.log("Pac man");
        var audio = new Audio('assets/sounds/select.wav');
        audio.play();
        setTimeout(function(){ document.location.href = "indexPacMan.html";}, 200);        
    } else if (event.x > 170 && event.x < 400 && event.y > 232 && event.y < 257){
        console.log("Space invaders");
        var audio = new Audio('assets/sounds/select.wav');
        audio.play();
        setTimeout(function(){ document.location.href = "indexSpaceInvader.html";}, 200);

        /*jeuSpace = new SpaceInvaders(canvas,ctx);
        jeuSpace.launchSpaceInvaders();
        jeu = jeuSpace;
        requestAnimationFrame(mainLoop);*/
    } else {
        console.log("msdfghi");
    }

}

function mainLoop(){

    ctx.clearRect(0, 0, w, h);
    writeGames();
    lesEtoilesFilantes();
    requestAnimationFrame(mainLoop);
}

function lesEtoilesFilantes(){
    stars.forEach(star => {
        drawAStar(star);
        updateAStar(star);
    });

}

function drawAStar(star){
    ctx.save();
  
    ctx.beginPath();
    ctx.moveTo(star.x,star.y);
    ctx.lineTo(star.x+star.dx, star.y+star.dy);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = star.width;
    ctx.stroke();
    ctx.restore();
}

function updateAStar(star){
    star.x += star.dx;
    star.y += star.dy;
    if(star.x > w || star.y > h){
        star.x = star.initX;
        star.y = star.initY;
    }
}

function playAudio(){
    var audio = new Audio('assets/sounds/bubbles.wav');
    audio.play();
}