/**
 * Author   : EOF
 * File     : script.js
 * Date     : 2017/09/03.
 */

var ImageBuilder = function(filePath) {
    "use strict";
    var img = new Image();
    img.src = filePath;
    return img;
};

function log(message) {
    "use strict";
    console.log(message);
}

var LocationFactory = function(xVal, yVal) {
    return { x: xVal, y: yVal };
}
var DirectionFactory = LocationFactory;

function modalPopup(message, header) {
    $('.modal-message').text(message);
    $('.modal-box h3').text(header);

    setTimeout(function() {
        $('.modal-overlay').show();
        $('body').addClass('game-over');
    }, 100);
}

function Ball(ballImage, customLocation, customDirection) {
    var image = ballImage;
    var width = image.width;
    var height = image.height;
    var location = customLocation;
    var direction = customDirection;

    this.getImage = function () {
        return image;
    }

    this.getWidth = function() {
        return width;
    }
    this.getHeight = function() {
        return height;
    }
    this.getLocation = function() {
        return location;
    }
    this.setLocation = function (customLocation) {
        location = customLocation;
    }

    this.move = function(speed, boundary) {

        // Rebound when the ball hit on the boundary
        if (location.y + height + direction.y * speed > boundary.height.max) {
            if (direction.y > 0) {
                direction.y *= -1;
            }
        }

        // check if hit the upper boundary
        if (location.y + direction.y * speed < boundary.height.min) {
            if (direction.y < 0) {
                direction.y *= -1;
            }
        }

        // check if hit the right boundary
        if (location.x + width + direction.x * speed > boundary.width.max) {
            if (direction.x > 0) {
                direction.x *= -1;
            }
        }

        // check if hit the left boundary
        if (location.x + direction.x * speed < boundary.width.min) {
            if (direction.x < 0) {
                direction.x *= -1;
            }
        }

        location.x += direction.x * speed;
        location.y += direction.y * speed;
    }
}

function Paddle(paddleImage, customLocation) {
    var image = paddleImage;
    var width = image.width;
    var height = image.height;
    var location = customLocation;

    this.getImage = function () {
        return image;
    }

    this.getWidth = function() {
        return width;
    }

    this.getHeight = function() {
        return height;
    }

    this.getLocation = function() {
        return location;
    }

    this.setLocation = function (customLocation) {
        location = customLocation;
    }

    // Handler for action
    this.moveLeft = function(speed, boundary) {
        if (location.x - speed < boundary.width.min) {
            location.x = boundary.width.min;
        } else {
            location.x -= speed;
        }
    };

    // Handler for action
    this.moveRight = function(speed, boundary) {
        if (location.x + width + speed > boundary.width.max) {

            location.x = boundary.width.max - paddle.width;
        } else {
            location.x += speed;
        }
    };
}

var configuration = {
    chanceLeft : 2,
    difficulty : 2
};

var imgBall = ImageBuilder("./img/octocat.png");
var imgPaddle = ImageBuilder("./img/paddle.png");

// degree of difficulty
function BreakOutGame(config) {
    "use strict";
    var gameStatus = "UnStart";
    var chanceLeft  = 2;

    // how much score the user got in this game
    var score = 0;

    var boardWidth = 460;
    var boardHeight = 500;
    var boardBoundary = {
        width: { min: 0, max: boardWidth },
        height: { min: 0, max: boardHeight }
    };

    var paddle = new Paddle(imgPaddle, LocationFactory(0, boardHeight - imgPaddle.height));
    var balls = [
        new Ball(imgBall, LocationFactory((boardWidth - imgBall.width)/2, 0), DirectionFactory(+1, +2)),
        new Ball(imgBall, LocationFactory((boardWidth - imgBall.width)/2, 0), DirectionFactory(-2, +1))
    ];

    var defaultPaddleSpeed = 10;
    var defaultBallSpeed = 6;

    var gameBoardCanvas = document.getElementById('gameBoard');
    gameBoardCanvas.width = boardWidth;
    gameBoardCanvas.height = boardHeight;

    var gameBoardCanvasContext = gameBoardCanvas.getContext("2d");

    var keyPressedDowns = {};
    // events
    window.addEventListener('keydown', function(event) {
        keyPressedDowns[event.key] = true;
        if (event.key === " ") {
            _restart();
        }
    });

    window.addEventListener('keyup', function(event) {
        keyPressedDowns[event.key] = false;
    });

    var keyActions = {};
    keyActions['a'] = paddle.moveLeft;
    keyActions["ArrowLeft"] = paddle.moveLeft
    keyActions['d'] = paddle.moveRight;
    keyActions["ArrowRight"] = paddle.moveRight;

    function refreshScreen(canvasContext) {
        canvasContext.clearRect(0, 0, boardWidth, boardHeight);
        canvasContext.drawImage(paddle.getImage(), paddle.getLocation().x, paddle.getLocation().y);
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            canvasContext.drawImage(ball.getImage(), ball.getLocation().x, ball.getLocation().y);
        }
        
        $(".instr").text("Score : " + score);
    }

    function checkIfGameOver() {
        var gameOver = false;
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            var ballLocation = ball.getLocation();
            if ((ballLocation.y + ball.getHeight()) < (boardHeight - paddle.getHeight())) {
                gameOver = false; // redundant assignment with intention
                continue;
            }
            var paddleLocation = paddle.getLocation();
            if (ballLocation.x > (paddleLocation.x + paddle.getWidth()) ||
                (ballLocation.x + ball.getWidth()) < paddleLocation.x) {
                gameOver = true;
                break;
            }
        }

        score += 10;
        return gameOver;
    }

    var deamon = function() {
        if (!(gameStatus === "Running")){
            return;
        }

        var gameOver = checkIfGameOver();
        if (gameOver) {
            if (chanceLeft > 0) {
                $('.life .heart').eq(chanceLeft).addClass('heart-o');
                chanceLeft -= 1;
                gameStatus = "Failed";
            } else {
                modalPopup("gameOverMessage", "gameOverHeader");
            }
            return;
        }

        for (var key in keyPressedDowns) {
            log("Daemon: " + key + " PressedDown: " + keyPressedDowns[key]);
            if ((key == 'a' || key == 'd' || key == "ArrowLeft" || key == "ArrowRight") 
                && keyPressedDowns[key]) {
                keyActions[key](defaultPaddleSpeed, boardBoundary);
                refreshScreen(gameBoardCanvasContext);
            }
        }

        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            ball.move(defaultBallSpeed, boardBoundary);
        }
        
        refreshScreen(gameBoardCanvasContext);
    };

    var _restart = function () {
        paddle.setLocation(LocationFactory(0, boardHeight - imgPaddle.height));
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            ball.setLocation(LocationFactory((boardWidth - imgBall.width)/2, 0));
        }
        gameStatus = "Running";
    }

    this.restart = _restart;

    this.start = function() {
        // timer
        setInterval(deamon, 1000 / 30);
    }
}

window.onload = function() {

    var breakOutGame = new BreakOutGame();

    breakOutGame.start();
}

//# sourceMappingURL=srcipt.js