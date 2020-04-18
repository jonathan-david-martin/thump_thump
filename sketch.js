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

function setup() {
  createCanvas(1200, 800);
  for (var i = 0; i < 8; i++) {
    heartArr.push(new heart(random(1200), random(800), 9));
  }
  //heart1 = new heart(x, y, 9);
  heart2 = new heart(400, 400, 9);
  heart2.velocity.setMag(0);

  CountDown1 = new CountDown(100, 100);

}

function draw() {
  background(0);


  for (var i = 0; i < heartArr.length; i++) {
    heartArr[i].timer();
    heartArr[i].update();
    heartArr[i].checkAlive();
  }
  heart2.timer();
  heart2.update();
  heart2.checkAlive();

  CountDown1.update();

  if (heartArr.length === 0 || heart2.row < 0) {
    CountDown1.color = 'red';
    CountDown1.update();
    noLoop();

  }


  //check for collision
  for (var i = 0; i < heartArr.length; i++) {
    if (dist(heartArr[i].location.x, heartArr[i].location.y - 80, heart2.location.x, heart2.location.y - 80) < 200) {
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

  for (var i = heartArr.length - 1; i >= 0; i--) {
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

  constructor(x, y, row) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.born = millis();
    this.alive = true;
    this.xVel = random(-2, 2);
    this.yVel = random(-2, 2);
    this.location = createVector(x, y);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
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
    //this.x += this.xVel;
    //this.y += this.yVel;
    this.velocity.limit(10);
    this.location.add(this.velocity);

    if (this.location.x-80 < 0) {
      //this.location.x = 80;
      this.location.x += 1600;
    }
    if (this.location.x-80 > 1200) {
      //this.location.x = 1040;
      this.location.x -= 1600;
    }
    if (this.location.y-160 < 0) {
       //this.location.y = 80;
      this.location.y += 800;
    }
    if (this.location.y > 800) {
      //this.location.y = 640;
     this.location.y -= 800;
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
    rect(this.location.x, this.location.y, 20, 20);
    //row2
    if (2 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - 20, this.location.y - 20, 20, 20);
    rect(this.location.x, this.location.y - 20, 20, 20);
    rect(this.location.x + 20, this.location.y - 20, 20, 20);
    //row3
    if (3 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - 40, this.location.y - 40, 20, 20);
    rect(this.location.x - 20, this.location.y - 40, 20, 20);
    rect(this.location.x, this.location.y - 40, 20, 20);
    rect(this.location.x + 20, this.location.y - 40, 20, 20);
    rect(this.location.x + 40, this.location.y - 40, 20, 20);
    //row4
    if (4 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - 60, this.location.y - 60, 20, 20);
    rect(this.location.x - 40, this.location.y - 60, 20, 20);
    rect(this.location.x - 20, this.location.y - 60, 20, 20);
    rect(this.location.x, this.location.y - 60, 20, 20);
    rect(this.location.x + 20, this.location.y - 60, 20, 20);
    rect(this.location.x + 40, this.location.y - 60, 20, 20);
    rect(this.location.x + 60, this.location.y - 60, 20, 20);
    //row5
    if (5 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - 80, this.location.y - 80, 20, 20);
    rect(this.location.x - 60, this.location.y - 80, 20, 20);
    rect(this.location.x - 40, this.location.y - 80, 20, 20);
    rect(this.location.x - 20, this.location.y - 80, 20, 20);
    rect(this.location.x, this.location.y - 80, 20, 20);
    rect(this.location.x + 20, this.location.y - 80, 20, 20);
    rect(this.location.x + 40, this.location.y - 80, 20, 20);
    rect(this.location.x + 60, this.location.y - 80, 20, 20);
    rect(this.location.x + 80, this.location.y - 80, 20, 20);

    //row6
    if (6 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - 80, this.location.y - 100, 20, 20);
    rect(this.location.x - 60, this.location.y - 100, 20, 20);
    rect(this.location.x - 40, this.location.y - 100, 20, 20);
    rect(this.location.x - 20, this.location.y - 100, 20, 20);
    rect(this.location.x, this.location.y - 100, 20, 20);
    rect(this.location.x + 20, this.location.y - 100, 20, 20);
    rect(this.location.x + 40, this.location.y - 100, 20, 20);
    rect(this.location.x + 60, this.location.y - 100, 20, 20);
    rect(this.location.x + 80, this.location.y - 100, 20, 20);

    //row7
    if (7 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(this.location.x - 80, this.location.y - 120, 20, 20);
    rect(this.location.x - 60, this.location.y - 120, 20, 20);
    rect(this.location.x - 40, this.location.y - 120, 20, 20);
    rect(this.location.x - 20, this.location.y - 120, 20, 20);
    rect(this.location.x, this.location.y - 120, 20, 20);
    rect(this.location.x + 20, this.location.y - 120, 20, 20);
    rect(this.location.x + 40, this.location.y - 120, 20, 20);
    rect(this.location.x + 60, this.location.y - 120, 20, 20);
    rect(this.location.x + 80, this.location.y - 120, 20, 20);

    //row8
    if (8 <= this.row) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }

    rect(this.location.x - 60, this.location.y - 140, 20, 20);
    rect(this.location.x - 40, this.location.y - 140, 20, 20);
    rect(this.location.x - 20, this.location.y - 140, 20, 20);
    rect(this.location.x + 20, this.location.y - 140, 20, 20);
    rect(this.location.x + 40, this.location.y - 140, 20, 20);
    rect(this.location.x + 60, this.location.y - 140, 20, 20);
  }


}