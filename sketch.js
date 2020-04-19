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
var wave;


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


    countDown1 = new CountDown(30, 30, 100);
    wave = new p5.Oscillator;
    wave.setType('sine');

}

function draw() {
    background(0);


    for (let i = 0; i < heartArr.length; i++) {
        heartArr[i].timer();
        heartArr[i].update();
        heartArr[i].checkAlive();
    }
    playerHeart.timer();
    playerHeart.update();
    playerHeart.checkAlive();

    if (game.state === 'run') {
        countDown1.update();
    }


    if (heartArr.length < maxHearts || playerHeart.row < 0) {
        countDown1.color = 'red';
        countDown1.update();

        textAlign(CENTER, CENTER);


        textSize(71);
        fill(0);
        text('♡keep♡trying♡', screenWidth / 2, screenHeight / 2 - 60);

        textSize(70);
        fill(255, 0, 0);
        text('♡keep♡trying♡', screenWidth / 2, screenHeight / 2 - 60);

        noLoop();

    }

    if (countDown1.time === 0) {

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
        }
    }

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
        text("USE ARROW KEYS", screenWidth / 2, screenHeight / 2 + 150);
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

class Game {
    constructor() {
        this.state = 'run';
    }
}

class CountDown {
    constructor(x, y, availTime) {
        this.x = x;
        this.y = y;
        this.score = 0;
        this.color = 'white';
        this.availTime = availTime;
        this.time = this.availTime;


    }

    update() {
        if (game.state === 'run') {
            this.time = this.availTime - round(millis() / 1000, 0);
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
    }

    timer() {
        if (this.player === true) {
            this.row = 9 - ((millis() - this.born) / 1000) * (7/heartArr.length);
        } else {
            this.row = 9 - ((millis() - this.born) / 1600) * (7/heartArr.length);
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

        if (round(millis() / 1000, 0) === 50) {
            this.blockSize = this.startSize * 0.75;
            this.heartRate = 40;
        }
        if (round(millis() / 1000, 0) === 75) {
            this.blockSize = this.startSize * 0.5;
            this.heartRate = 25;
        }

        if (this.player === true) {
            this.velocity.limit(5);
        } else {
            this.velocity.limit(4);
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
        //text(this.row,this.location.x-30,this.location.y);
        //row1


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