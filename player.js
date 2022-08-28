let player;
let playerYPosition = 200;
let dropSpeed = 0;
let interval = setInterval(updateCanvas, 20);
let isJump = false;
let jumpSpeed = 0;
let score = 0;
let scoreLabel;

function startGame() {
    gameCanvas.start();
    player = new createPlayer(30, 30, 10);
    block = new createBlock();
    scoreLabel = new createScoreLabel(10, 30);
}

function createPlayer(width, height, x) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = playerYPosition;

    // ctx = gameCanvas.context;
    // ctx.fillStyle = "white";
    // ctx.fillRect(this.x, this.y, this.width, this.height);

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.makeFall = function() {
        if (!isJump) {
            this.y += dropSpeed;
            dropSpeed += 0.03;
            this.stopPlayer();
        }
    }
    this.stopPlayer = function() {
        let ground = canvasHeight - this.height;
        if (this.y > ground) {
            this.y = ground;
        }
    }
    this.jump = function() {
        if (isJump) {
            this.y -= jumpSpeed;
            jumpSpeed += 0.3;
        }
    }
}

function createBlock() {
    var width = randomNumber(10, 50);
    var height = randomNumber(10, 200);
    var speed = randomNumber(2, 6);

    this.x = canvasWidth;
    this.y = canvasHeight - height;

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, width, height);
    }
    this.attackPlayer = function() {
        this.x -= speed;
        this.returnToAttackPosition();
    }
    this.returnToAttackPosition = function() {
        if (this.x < 0) {
            width = randomNumber(10, 50);
            height = randomNumber(50, 200);
            speed = randomNumber(4, 6);
            this.y = canvasHeight - height;
            this.x = canvasWidth;

            score++;
        }
    }
}

function createScoreLabel(x, y) {
    this.score = 0;
    this.x = x;
    this.y = y;
    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.font = "25px Marker Felt";
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.x, this.y);
    }
}

function detectCollision() {
    var playerLeft = player.x
    var playerRight = player.x + player.width;
    var blockLeft = block.x;
    var blockRight = block.x + block.width;

    var playerBottom = player.y + player.height;
    var blockTop = block.y;

    if (playerRight > blockLeft &&
        playerLeft < blockLeft &&
        playerBottom > blockTop) {

        gameCanvas.stop();
    }

}

function updateCanvas() {
    detectCollision();
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    player.makeFall();
    player.draw();
    player.jump();

    block.draw();
    block.attackPlayer();
    scoreLabel.text = "SCORE: " + score;
    scoreLabel.draw();

}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function resetJump() {
    jumpSpeed = 1;
    isJump = false;
}

document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        isJump = true;
        setTimeout(function() { resetJump(); }, 1000);
    }
}