//thump thump
//game for ludum dare 46
//theme: stay alive

var t = 0;
var x = 200;
var y = 200;
var maxHearts = 6;
var playerHeart;
var heartArr = [];
var countDown1;
var screenWidth = 1000;
var screenHeight = 600;
var blockSizeStandard = 8;
var maxTime = 100;
var wave;
var quickSand1;
var quickSand2;



function setup() {
    createCanvas(screenWidth, screenHeight);
    textFont("Audiowide");
    game = new Game();
    for (let i = 0; i < maxHearts; i++) {
        heartArr.push(new heart(random(screenWidth), random(screenHeight), blockSizeStandard, 9));
    }

    playerHeart = new heart(400, 400, blockSizeStandard, 9);
    playerHeart.velocity.setMag(0);
    playerHeart.player = true;

    //heartArr.push(playerHeart);


    countDown1 = new CountDown(30, 30, maxTime);
    wave = new p5.Oscillator;
    wave.setType('sine');

}

function mousePressed() {

        //console.log(game);

        if(game.state === 'end') {
            game.state = 'restart';
            loop();
        }

}

function draw() {
    background(0);

    //if on level2 draw the quicksand
    if(game.state==='level2'){
        quickSand1.update();
        quickSand2.update();

        //check for collision with quickSand
        for (let i = 0; i < heartArr.length; i++) {
            if ((dist(heartArr[i].location.x, heartArr[i].location.y - heartArr[i].blockSize * 4, quickSand1.x, quickSand1.y ) < 100)||
                (dist(heartArr[i].location.x, heartArr[i].location.y - heartArr[i].blockSize * 4, quickSand2.x, quickSand2.y ) < 100)
               )
             {
                if(heartArr[i].inQuicksand === false) {
                    console.log('in quicksand');
                    //noLoop();
                    heartArr[i].inQuicksand = true;
                    heartArr[i].velocity.mult(0.1);
                    heartArr[i].quickSandDrop=3;
                }
            }
            else{
                //if hearts are outside of quicksand
                //if inQuicksand still says true, it has just exited quicksand
                if(heartArr[i].inQuicksand===true){
                    //reset velocity to original value
                    heartArr[i].velocity.mult(10);
                    heartArr[i].inQuicksand=false;
                }
            }

        }

    }

    if(game.state === 'restart'){
        game.state = 'level1';
        for (let i = 0; i < heartArr.length; i++) {
            heartArr[i].born = millis();
            heartArr[i].alive = true;
            playerHeart.born = millis();
            playerHeart.alive = true;
        }
        countDown1.elapsedTimeMillis = round(millis()/1000,0);
        countDown1.elapsedFrameCount = frameCount;
    }

    for (let i = 0; i < heartArr.length; i++) {
        heartArr[i].timer();
        heartArr[i].update();
        heartArr[i].checkAlive();
    }
    playerHeart.timer();
    playerHeart.update();
    playerHeart.checkAlive();

    if (game.state != 'end') {
        countDown1.update();
    }

    if (heartArr.length < maxHearts || playerHeart.row < 0) {
        game.state = 'end';
        countDown1.color = 'red';
        countDown1.update();

        textAlign(CENTER, CENTER);

        textSize(71);
        fill(0);
        text('♡keep♡trying♡', screenWidth / 2, screenHeight / 2 - 60);

        textSize(70);
        fill(255, 0, 0);
        text('♡keep♡trying♡', screenWidth / 2, screenHeight / 2 - 60);

        textSize(71);
        fill(0);
        text('♡click♡to♡restart♡', screenWidth / 2, screenHeight / 2 + 30);

        textSize(70);
        fill(255);
        text('♡click♡to♡restart♡', screenWidth / 2, screenHeight / 2 + 30);

        noLoop();

    }

    if (countDown1.time === 0 && game.state === 'level2') {
        //paint the screen black and then redraw all elements
        //with you won message
        game.state = 'end';
        background(0);

        for (let i = 0; i < heartArr.length; i++) {
            heartArr[i].timer();
            heartArr[i].update();
            heartArr[i].checkAlive();
        }
        playerHeart.timer();
        playerHeart.update();
        playerHeart.checkAlive();

        console.log(countDown1);

        textAlign(CENTER, CENTER);
        textSize(500);
        fill(255, 0, 0);
        text('♡', screenWidth / 2, screenHeight / 2);

        textSize(350);
        fill(255);
        text('♡', screenWidth / 2, screenHeight / 2);

        textSize(71);
        fill(0);
        text('♡u♡win♡', screenWidth / 2, screenHeight / 2 - 60);

        textSize(70);
        fill(255, 0, 0);
        text('♡u♡win♡', screenWidth / 2, screenHeight / 2 - 60);

        noLoop();
    }

    if (countDown1.time === 0 && game.state === 'level1') {

        //restart game on level2
        game.state = 'level2';
        //create some quicksand to slow the hearts
        quickSand1 = new quickSand(screenWidth*0.2,screenHeight*0.2,200);
        quickSand2 = new quickSand(screenWidth*0.8,screenHeight*0.8,200);

        //reset the life of the hearts and increase the speed limit
        for (let i = 0; i < heartArr.length; i++) {
            heartArr[i].born = millis();
            heartArr[i].alive = true;
            heartArr[i].speedLimit = 5;
            playerHeart.born = millis();
            playerHeart.alive = true;
        }
        countDown1.elapsedTimeMillis = round(millis()/1000,0);
        countDown1.elapsedFrameCount = frameCount;
    }



    //check for collision with playerHeart
    for (let i = 0; i < heartArr.length; i++) {
        if (dist(heartArr[i].location.x, heartArr[i].location.y - heartArr[i].blockSize * 4, playerHeart.location.x, playerHeart.location.y - playerHeart.blockSize * 4) < playerHeart.blockSize * 10) {
            //countDown1.score+=10;
            heartArr[i].velocity.add(playerHeart.velocity);
            heartArr[i].location.x += playerHeart.velocity.x * 2;
            heartArr[i].location.y += playerHeart.velocity.y * 2;
            heartArr[i].velocity.x += random(-5, 5);
            heartArr[i].velocity.y += random(-5, 5);
            heartArr[i].born = millis();
            playerHeart.born = millis();
            heartArr[i].quickSandDrop = 0;

        }
    }

    //check for collision only between non-player hearts
    for (let j = 0; j < heartArr.length; j++) {
        for (let i = 0; i < heartArr.length; i++) {
            if (dist(heartArr[i].location.x, heartArr[i].location.y - heartArr[i].blockSize * 4, heartArr[j].location.x, heartArr[j].location.y - heartArr[j].blockSize * 4) < heartArr[j].blockSize * 10) {
                //don't compare the same object with itself
                if(!Object.is(heartArr[j],heartArr[i])) {
                    heartArr[i].velocity.add(heartArr[j].velocity);
                    heartArr[i].location.x += heartArr[j].velocity.x * 1.2;
                    heartArr[i].location.y += heartArr[j].velocity.y * 1.2;
                    //heartArr[i].velocity.x += random(-5, 5);
                    //heartArr[i].velocity.y += random(-5, 5);
                    heartArr[i].born = millis();
                    heartArr[j].born = millis();
                    heartArr[i].quickSandDrop = 0;
                    heartArr[j].quickSandDrop = 0;

                }

            }
        }
    }



    for (let i = heartArr.length - 1; i >= 0; i--) {
        //console.log(heartArr);
        if (heartArr[i].alive === false) {
            heartArr.splice(i, 1);
        }
    }


    if (keyIsPressed && keyCode === RIGHT_ARROW) {
        playerHeart.velocity.x += 1;
    }

    if (keyIsPressed && keyCode === LEFT_ARROW) {
        playerHeart.velocity.x -= 1;
    }

    if (keyIsPressed && keyCode === UP_ARROW) {
        playerHeart.velocity.y -= 1;
    }

    if (keyIsPressed && keyCode === DOWN_ARROW) {
        playerHeart.velocity.y += 1;
    }

    if (keyIsPressed && (key === 'd' || key === 'D')) {
        playerHeart.velocity.x += 1;
    }

    if (keyIsPressed && (key === 'a' || key === 'A')) {
        playerHeart.velocity.x -= 1;
    }

    if (keyIsPressed && (key === 'w' || key === 'W')) {
        playerHeart.velocity.y -= 1;
    }

    if (keyIsPressed && (key === 's' || key === 'S')) {
        playerHeart.velocity.y += 1;
    }

    //if(keyIsPressed){
    //    wave.start();
    //    wave.amp(0.1);
    //}
    if (frameCount < 160) {
        textAlign(CENTER, CENTER);
        //textFont("Audiowide");
        textSize(100);
        text("THUMP-THUMP", screenWidth / 2, screenHeight / 2);
        textSize(50);
        text("ARROW KEYS OR WASD", screenWidth / 2, screenHeight / 2 + 150);
    }


}

function checkCollision(heart){
    //check for collision between non player hearts
    for (let i = 0; i < heartArr.length; i++) {
        if (dist(heartArr[i].location.x, heartArr[i].location.y - heartArr[i].blockSize * 4, heart.location.x, heart.location.y - heart.blockSize * 4) < heart.blockSize * 10) {
            return heartArr[i];
        }
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class quickSand{

    constructor(x,y,dia){
        this.x=x;
        this.y=y;
        this.dia=dia;
    }

    display(){
        fill(255);
        ellipse(this.x,this.y,this.dia,this.dia);
    }

    update(){
        this.display();
    }

}

class Game {
    constructor() {
        this.state = 'level1';
    }
}

//⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚
//⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚
//⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚
//⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚⌚

class CountDown {
    constructor(x, y, availTime) {
        this.x = x;
        this.y = y;
        this.score = 0;
        this.color = 'white';
        this.availTime = availTime;
        this.time = this.availTime;
        this.elapsedTimeMillis = 0;
        this.elapsedFrameCount = 0;

    }

    update() {
        if (game.state != 'end') {
            this.time = this.availTime + this.elapsedTimeMillis - round(millis() / 1000, 0);
            this.display();
        }

    }


    display() {

        textSize(45);
        fill(0);
        textAlign(LEFT);
        text('time:' + this.time, this.x, this.y);
        textSize(43);
        if (this.color === 'white') {
            fill(255);
        } else if (this.color === 'red') {
            fill(255, 0, 0);
        }
        text('time:' + this.time, this.x, this.y);

    }


}

//♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡
//♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡
//♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡
//♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡

class heart {

    constructor(x, y, blockSize, row) {
        this.x = x;
        this.y = y;
        this.blockSize = blockSize;
        this.startSize = blockSize;
        this.row = row;
        this.born = millis();
        this.alive = true;
        this.xVel = random(-2, 2);
        this.yVel = random(-2, 2);
        this.location = createVector(x, y);
        this.velocity = createVector(random(-2, 2), random(-2, 2));
        this.player = false;
        this.heartRate = 50;
        this.inQuicksand = false;
        this.elapsedMillis = 0;
        this.speedLimit = 4;
        this.quickSandDrop = 0;
    }

    timer() {
        if (this.player === true) {
            this.row = 9 - ((millis() - this.born) / 1000) * (7/heartArr.length);
        } else {
            this.row = 9 - ((millis() - this.born) / 1600) * (7/heartArr.length)-this.quickSandDrop;
        }
    }

    checkAlive() {
        if (this.row < 0) {
            this.alive = false;
        } else {
            this.alive = true;
        }

    }

    sound() {
        if (this.player === true) {
            if (frameCount % this.heartRate === 0) {
                wave.start();
                wave.amp(0.1);
                wave.freq(200);
                //wave.stop();
                this.startTime = frameCount;
                this.blockSize = this.startSize * 1.2;
            } else {
                wave.stop();
                this.blockSize = this.startSize;
            }

            if (frameCount - this.startTime === 10) {
                wave.start();
                wave.amp(0.1);
                wave.freq(200);
                //wave.stop();
                this.blockSize = this.startSize * 1.2;
            }

        }

    }


    update() {
        //this next if statement was added for level2 to reset size
        //and heart rate to the starting values
        if (round(millis() / 1000, 0)-countDown1.elapsedTimeMillis === 0) {
            this.blockSize = this.startSize ;
            this.heartRate = 50;
        }

        if (round(millis() / 1000, 0)-countDown1.elapsedTimeMillis === 25) {
            this.blockSize = this.startSize * 0.85;
            this.heartRate = 45;
        }

        if (round(millis() / 1000, 0)-countDown1.elapsedTimeMillis === 50) {
            this.blockSize = this.startSize * 0.7;
            this.heartRate = 40;
        }
        if (round(millis() / 1000, 0)-countDown1.elapsedTimeMillis === 75) {
            this.blockSize = this.startSize * 0.5;
            this.heartRate = 25;
        }

        if (this.player === true) {
            this.velocity.limit(5);
        } else {
            this.velocity.limit(this.speedLimit);
        }

        this.location.add(this.velocity);

        if (this.location.x - this.blockSize * 4 < 0) {
            //this.location.x = this.blockSize*4;
            this.location.x += screenWidth;
        }
        if (this.location.x - this.blockSize * 4 > screenWidth) {
            //this.location.x = 1040;
            this.location.x -= screenWidth;
        }
        if (this.location.y - this.blockSize * 8 < 0) {
            //this.location.y = this.blockSize*4;
            this.location.y += screenHeight;
        }
        if (this.location.y > screenHeight) {
            //this.location.y = 640;
            this.location.y -= screenHeight;
        }

        this.display();
        this.sound();
    }

    display() {

        if (1 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        rect(this.location.x, this.location.y, this.blockSize, this.blockSize);
        //row2
        if (2 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        rect(this.location.x - this.blockSize, this.location.y - this.blockSize, this.blockSize, this.blockSize);
        rect(this.location.x, this.location.y - this.blockSize, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize, this.location.y - this.blockSize, this.blockSize, this.blockSize);
        //row3
        if (3 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        rect(this.location.x - this.blockSize * 2, this.location.y - this.blockSize * 2, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize, this.location.y - this.blockSize * 2, this.blockSize, this.blockSize);
        rect(this.location.x, this.location.y - this.blockSize * 2, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize, this.location.y - this.blockSize * 2, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 2, this.location.y - this.blockSize * 2, this.blockSize, this.blockSize);
        //row4
        if (4 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        rect(this.location.x - this.blockSize * 3, this.location.y - this.blockSize * 3, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 2, this.location.y - this.blockSize * 3, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize, this.location.y - this.blockSize * 3, this.blockSize, this.blockSize);
        rect(this.location.x, this.location.y - this.blockSize * 3, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize, this.location.y - this.blockSize * 3, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 2, this.location.y - this.blockSize * 3, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 3, this.location.y - this.blockSize * 3, this.blockSize, this.blockSize);
        //row5
        if (5 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        rect(this.location.x - this.blockSize * 4, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 3, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 2, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 2, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 3, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 4, this.location.y - this.blockSize * 4, this.blockSize, this.blockSize);

        //row6
        if (6 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        rect(this.location.x - this.blockSize * 4, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 3, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 2, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 2, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 3, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 4, this.location.y - this.blockSize * 5, this.blockSize, this.blockSize);

        //row7
        if (7 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        rect(this.location.x - this.blockSize * 4, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 3, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 2, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 2, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 3, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 4, this.location.y - this.blockSize * 6, this.blockSize, this.blockSize);

        //row8
        if (8 <= this.row) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }

        rect(this.location.x - this.blockSize * 3, this.location.y - this.blockSize * 7, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize * 2, this.location.y - this.blockSize * 7, this.blockSize, this.blockSize);
        rect(this.location.x - this.blockSize, this.location.y - this.blockSize * 7, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize, this.location.y - this.blockSize * 7, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 2, this.location.y - this.blockSize * 7, this.blockSize, this.blockSize);
        rect(this.location.x + this.blockSize * 3, this.location.y - this.blockSize * 7, this.blockSize, this.blockSize);
    }


}