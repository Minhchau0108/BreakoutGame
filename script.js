let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
/*
Variables about our Game 's state 
*/
// Ball variables
let ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 3;
let dy = -3;


// Paddle Variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;


// shoot Variable
let shootWidth = 5;
let shootHeight = 10;
let shootY = canvas.height - shootHeight;
let shootX = paddleX + 37;

// Key Press Variables
let rightPressed = false;
let leftPressed = false;
let upPressed = false;

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
    if(i == 2|| i == 4)
    {
      bricks[i][j] = { x: 0, y: 0, status: 1, isPower: false , isDurable: true, hit: 0};
    }
    if(i == 0){
      bricks[i][j] = { x: 0, y: 0, status: 1, isPower: false, isDurable: false, hit: 0};  
    }
    if(i == 1 || i == 3){
      if(j == 1){
        bricks[i][j] = { x: 0, y: 0, status: 1, isPower: true , isDurable: false, hit: 0};
      }
      else{
        bricks[i][j] = { x: 0, y: 0, status: 1, isPower: false , isDurable: true, hit: 0};
      }
    }
  }
}


// Scores and Lives
let score = 0;
let lives = 8;
let hittedBricksInOneCombo = 0;
let totalHittedBricks = 0;

/**********************/

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyShootDownHandler, false);
document.addEventListener("keyup", keyShootUpHandler, false);


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
function keyShootDownHandler(e){
  if(e.key == "Up" || e.key == "ArrowUp" || e.keyCode == '38') {
    upPressed = true;
    console.log('upPressed', upPressed);
  }
}
function keyShootUpHandler(e){
  if(e.key == "Up" || e.key == "ArrowUp" || e.keyCode == '38') {
    upPressed = false;
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
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight
          || shootX > b.x && shootX < b.x + brickWidth && shootY > b.y && shootY < b.y +brickHeight ) 
        {
          hittedBricksInOneCombo++;
          score += hittedBricksInOneCombo;
          shootY = canvas.height - shootHeight;
          if(b.isPower) 
          {
            console.log("we hit power brick");
            dy = -dy * 2;
            if(ballRadius >= 5){
              ballRadius = ballRadius/2;
            }
          }
          else{
            dy = -dy;
          }

          if(b.isDurable) {
            console.log("we hit durable brick");
            b.hit++;
          }

          if(!b.isDurable || (b.isDurable && b.hit === 5))
          {
            b.status = 0;
            totalHittedBricks++;
          }
          if(totalHittedBricks == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
          // shootY = canvas.height - shootHeight;
        }
      }
    }
  }
}

function drawShoot(){
  ctx.beginPath();
  ctx.rect(paddleX + 37, shootY, shootWidth, shootHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  console.log('draw shoot');
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
function drawBrick(brick){
  ctx.beginPath();
  ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
  if(brick.isPower)
  {
    ctx.fillStyle = "red";
  }
  if(brick.isDurable)
  {
    switch(brick.hit){
      case 0:
        ctx.fillStyle = "#021B79";
        break;
      case 1:
        ctx.fillStyle = "#1F1FFF";
        break;
      case 2: 
        ctx.fillStyle = "#4949FF";
        break;
      case 3: 
        ctx.fillStyle = "#7879FF";
        break;
      case 4: 
        ctx.fillStyle = "#A3A3FF";
        break;
      default:
        ctx.fillStyle = "#BFBFFF";
    }
  }
  if(!brick.isPower && !brick.isDurable)
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
        drawBrick(bricks[i][j]);
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
  drawShoot();
  drawScore();
  drawLives();

  collisionDetection();
}

function update(){
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
    brickOffsetTop += 1;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) {
    hittedBricksInOneCombo = 0;
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      console.log('hey, we hit the paddle');
    }
    else {
      lives--;
      if(!lives || brickOffsetTop === 320) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        console.log('we hit the ground');
        x = canvas.width/2;
        y = canvas.height-30;
        ballRadius = 10;
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

  // Shoot
  if(upPressed){
    shootY -= 3;
  }
  else{
    shootY = canvas.height - shootHeight;
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