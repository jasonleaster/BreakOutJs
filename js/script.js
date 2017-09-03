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

    $('.btn-play-again').on('click', function(e) {
        e.preventDefault();
        location.reload();
    });
}

function Ball(ballImage, customLocation) {
    var image = ballImage;
    var width = image.width;
    var height = image.height;
    var location = customLocation;
    var direction = DirectionFactory(+1, +2);

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

};

var imgBall = ImageBuilder("./img/octocat.png");
var imgPaddle = ImageBuilder("./img/paddle.png");

// degree of difficulty
function BreakOutGame(difficulty) {
    "use strict";

    var boardWidth = 460;
    var boardHeight = 500;
    var boardBoundary = {
        width: { min: 0, max: boardWidth },
        height: { min: 0, max: boardHeight }
    };

    var paddle = new Paddle(imgPaddle, LocationFactory(0, boardHeight - imgPaddle.height));
    var ball = new Ball(imgBall, LocationFactory((boardWidth - imgBall.width)/2, 0));

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
    });

    window.addEventListener('keyup', function(event) {
        keyPressedDowns[event.key] = false;
    });

    var keyActions = {};
    keyActions['a'] = paddle.moveLeft;
    keyActions['d'] = paddle.moveRight;

    function refreshScreen(canvasContext) {
        canvasContext.clearRect(0, 0, boardWidth, boardHeight);
        canvasContext.drawImage(paddle.getImage(), paddle.getLocation().x, paddle.getLocation().y);
        canvasContext.drawImage(ball.getImage(), ball.getLocation().x, ball.getLocation().y);
    }

    function checkIfGameOver () {
        var ballLocation = ball.getLocation();
        if ((ballLocation.y + ball.getHeight()) < (boardHeight - paddle.getHeight())) {
            return false;
        }
        var paddleLocation = paddle.getLocation();
        if (ballLocation.x > (paddleLocation.x + paddle.getWidth()) || 
            (ballLocation.x + ball.getWidth()) < paddleLocation.x){
            return true;
        }
        return false;
    }

    var deamon = function() {
        var gameOver = checkIfGameOver();
        if (gameOver) {
            return;
        }

        for (var key in keyPressedDowns) {
            log("Daemon: " + key + " PressedDown: " + keyPressedDowns[key]);
            if ((key == 'a' || key == 'd') && keyPressedDowns[key]) {
                keyActions[key](defaultPaddleSpeed, boardBoundary);
                refreshScreen(gameBoardCanvasContext);
            }
        }
        ball.move(defaultBallSpeed, boardBoundary);
        refreshScreen(gameBoardCanvasContext);
    };

    this.restart = function() {
        paddle.setLocation(LocationFactory(0, boardHeight - imgPaddle.height));
        ball.setLocation(LocationFactory((boardWidth - imgBall.width)/2, 0));
    }

    this.start = function() {
        // timer
        setInterval(deamon, 1000 / 30);
    }
}

window.onload = function() {

    var breakOutGame = new BreakOutGame();

    var restartBtn = document.getElementById("playAgainButton");
    restartBtn.onclick = function() {
        breakOutGame.restart();
    }

    breakOutGame.start();
}

//# sourceMappingURL=srcipt.js