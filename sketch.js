//thump thump
//game for ludum dare 46
//theme: stay alive

var t = 0;
var x = 200;
var y = 200;
var heart1;
var heart2;
var heartArr = [];
var countDown1;
var screenWidth = 1000;
var screenHeight = 600;

var wave;



function setup() {
  createCanvas(screenWidth, screenHeight);
  for (var i = 0; i < 8; i++) {
    heartArr.push(new heart(random(screenWidth), random(screenHeight), 10,9));
  }
  //heart1 = new heart(x, y, 9);
  heart2 = new heart(400, 400, 10,9);
  heart2.velocity.setMag(0);
  heart2.player = true;

  countDown1 = new CountDown(100, 100);
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
  heart2.timer();
  heart2.update();
  heart2.checkAlive();

  countDown1.update();

  if (heartArr.length === 0 || heart2.row < 0) {
      countDown1.color = 'red';
      countDown1.update();
    noLoop();

  }


  //check for collision
  for (let i = 0; i < heartArr.length; i++) {
    if (dist(heartArr[i].location.x, heartArr[i].location.y - heartArr[i].blockSize*4, heart2.location.x, heart2.location.y - heart2.blockSize*4) < heart2.blockSize*10) {
      //temp test collision
      //heartArr[i].xVel *= -1;
      //heartArr[i].yVel *= -1;
      heartArr[i].velocity.add(heart2.velocity);

      heartArr[i].location.x += heart2.velocity.x*2;
      heartArr[i].location.y += heart2.velocity.y*2;
      heartArr[i].born = millis();
      heart2.born = millis();
    }
  }

  for (let i = heartArr.length - 1; i >= 0; i--) {
    //console.log(heartArr);
    if (heartArr[i].alive === false) {
      heartArr.splice(i, 1);
    }
  }



  if (keyIsPressed && keyCode === RIGHT_ARROW) {
    heart2.velocity.x += 1;
  }

  if (keyIsPressed && keyCode === LEFT_ARROW) {
    heart2.velocity.x -= 1;
  }

  if (keyIsPressed && keyCode === UP_ARROW) {
     heart2.velocity.y -= 1;
  }

  if (keyIsPressed && keyCode === DOWN_ARROW) {
    heart2.velocity.y += 1;
  }

  //if(keyIsPressed){
  //    wave.start();
  //    wave.amp(0.1);
  //}



}

class CountDown {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'white';
  }
  update() {
    this.display();
  }

  display() {

    textFont("Audiowide");
    textSize(75);
    fill(0);
    text(round(millis() / 1000, 0), this.x, this.y);
    textSize(70);
    if (this.color === 'white') {
      fill(255);
    } else if (this.color === 'red') {
      fill(255, 0, 0);
    }
    text(round(millis() / 1000, 0), this.x, this.y);

  }



}

class heart {

  constructor(x, y, blockSize,row) {
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
  }

  timer() {
    this.row = 9 - (millis() - this.born) / 1000;
  }

  checkAlive() {
    if (this.row < 0) {
      this.alive = false;
    } else {
      this.alive = true;
    }

  }


  update() {

      if(this.player === true){
          if(frameCount%50===0){
              wave.start();
              wave.amp(0.1);
              wave.freq(200);
              //wave.stop();
              this.startTime = frameCount;
              this.blockSize = this.startSize*1.2;
          }
          else{
              //wave.stop();
              this.blockSize = this.startSize;
          }

          if(frameCount - this.startTime === 10){
              wave.start();
              wave.amp(0.1);
              wave.freq(200);
              //wave.stop();
              this.blockSize = this.startSize*1.2;
          }

      }

    //this.x += this.xVel;
    //this.y += this.yVel;
    this.velocity.limit(5);
    this.location.add(this.velocity);

    if (this.location.x-this.blockSize*4 < 0) {
      //this.location.x = this.blockSize*4;
      this.location.x += screenWidth;
    }
    if (this.location.x-this.blockSize*4 > screenWidth) {
      //this.location.x = 1040;
      this.location.x -= screenWidth;
    }
    if (this.location.y-this.blockSize*8 < 0) {
       //this.location.y = this.blockSize*4;
      this.location.y += screenHeight;
    }
    if (this.location.y > screenHeight) {
      //this.location.y = 640;
     this.location.y -= screenHeight;
    }

    this.display();
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
    rect(this.location.x - this.blockSize*2, this.location.y - this.blockSize*2, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize, this.location.y - this.blockSize*2, this.blockSize, this.blockSize);
    rect(this.location.x, this.location.y - this.blockSize*2, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize, this.location.y - this.blockSize*2, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*2, this.location.y - this.blockSize*2, this.blockSize, this.blockSize);
    //row4
    if (4 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - this.blockSize*3, this.location.y - this.blockSize*3, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*2, this.location.y - this.blockSize*3, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize, this.location.y - this.blockSize*3, this.blockSize, this.blockSize);
    rect(this.location.x, this.location.y - this.blockSize*3, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize, this.location.y - this.blockSize*3, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*2, this.location.y - this.blockSize*3, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*3, this.location.y - this.blockSize*3, this.blockSize, this.blockSize);
    //row5
    if (5 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - this.blockSize*4, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*3, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*2, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*2, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*3, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*4, this.location.y - this.blockSize*4, this.blockSize, this.blockSize);

    //row6
    if (6 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - this.blockSize*4, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*3, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*2, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*2, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*3, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*4, this.location.y - this.blockSize*5, this.blockSize, this.blockSize);

    //row7
    if (7 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - this.blockSize*4, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*3, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*2, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*2, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*3, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*4, this.location.y - this.blockSize*6, this.blockSize, this.blockSize);

    //row8
    if (8 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }

    rect(this.location.x - this.blockSize*3, this.location.y - this.blockSize*7, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize*2, this.location.y - this.blockSize*7, this.blockSize, this.blockSize);
    rect(this.location.x - this.blockSize, this.location.y - this.blockSize*7, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize, this.location.y - this.blockSize*7, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*2, this.location.y - this.blockSize*7, this.blockSize, this.blockSize);
    rect(this.location.x + this.blockSize*3, this.location.y - this.blockSize*7, this.blockSize, this.blockSize);
  }


}