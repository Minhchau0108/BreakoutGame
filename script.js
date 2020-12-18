let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
/*
Variables about our Game 's state 
*/
// Ball variables
let ballRadius = 20;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;

// Paddle Variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;

// Key Press Variables
let rightPressed = false;
let leftPressed = false;

// Brick Variables
let brickRowCount = 3;
let brickColumnCount = 5;

let brickWidth = 75;
let brickHeight = 20;

let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for(let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for(let j = 0; j < brickRowCount; j++) {
    if((i + j) % 3 === 0){
      bricks[i][j] = { x: 0, y: 0, status: 1, power: 1 , durable: 0, hit: 0};
    }
    else if ((i + j) % 3 === 1){
      bricks[i][j] = { x: 0, y: 0, status: 1, power: 0 , durable: 1, hit: 0};
    }
    else{
      bricks[i][j] = { x: 0, y: 0, status: 1, power: 0, durable: 0, hit: 0};
    }
    
  }
}

// Scores and Lives
let score = 0;
let numberOfBricks = 0;
let previousBrick = 0;
let lives = 8;

/**********************/

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function collisionDetection() {
  for(let i = 0; i < brickColumnCount; i++) {
    for(let j = 0; j < brickRowCount; j++) {
      let b = bricks[i][j];
      if(b.status == 1) {
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) // Neu hit
        {
          if(b.power == 1) 
          {
            dy = -dy * 2;
            if(ballRadius >= 10){
              ballRadius = ballRadius/2;
            }
          }
          else{
            dy = -dy;
          }

          if(b.durable === 1) {
            b.hit++;
          }

          if(b.durable === 0 || (b.durable === 1 && b.hit === 5))
          {
            b.status = 0;
            score++;

            if(previousBrick == 1){ 
              score ++;
            }
            else if(previousBrick == 2){
              score += 2;
            }
            else if(previousBrick >= 3){
              score += 3;
            }
            numberOfBricks++;
            previousBrick++;
          }

          if(numberOfBricks == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
      else{
        previousBrick == 0;
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
function drawBrick(brickX, brickY, power, durable, hit){
  ctx.beginPath();
  ctx.rect(brickX, brickY, brickWidth, brickHeight);
  if(power === 1) // power brick
  {
    ctx.fillStyle = "red";
  }
  else if(durable === 1) // durable brick 
  {
    if(hit === 0){
      ctx.fillStyle = "#021B79";
    }
    else if(hit === 1)
    {
      ctx.fillStyle = "#1F1FFF";
    }
    else if(hit === 2){
      ctx.fillStyle = "#4949FF";
    }
    else if(hit === 3){
      ctx.fillStyle = "#7879FF";
    }
    else if(hit === 4){
      ctx.fillStyle = "#A3A3FF";
    }
    else{
      ctx.fillStyle = "#BFBFFF";
    }
  }
  else// normal brick
  {
    ctx.fillStyle = "pink";
  }
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(let i = 0; i < brickColumnCount; i++) {
    for(let j = 0; j < brickRowCount; j++) {
      if(bricks[i][j].status == 1) {
        let brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        power = bricks[i][j].power;
        durable = bricks[i][j].durable;
        hit =  bricks[i][j].hit;
        drawBrick(brickX, brickY, power, durable,hit);
      }
    }
  }
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();

  collisionDetection();
}

function update(){

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;

      if(!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}

function main(){
  update();
  draw();
  window.requestAnimationFrame(main);
}

main();