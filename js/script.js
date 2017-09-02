var ImageBuilder = function(filePath) {
    "use strict";
    var img = new Image();
    img.src = filePath;
    return img;
};

function log (message) {
    "use strict";
    console.log(message);
}

window.onload = function() {
    "use strict";
    var boardWidth = 500;
    var boardHeight = 500;
    var gameBoardCanvas = document.getElementById("gameBoard");

    gameBoardCanvas.setAttribute("width", boardWidth);
    gameBoardCanvas.setAttribute("height", boardHeight);

    var gameBoardCanvasContext = gameBoardCanvas.getContext("2d");
    var paddle = ImageBuilder("./img/paddle.png");
    var ball   = ImageBuilder("./img/octocat.png");

    paddle.location = {
        x: 0,
        y: 0
    };

    ball.location = {
        x: 0,
        y: 0
    };

    var direction = {x : 0, y : +1};

    ball.move = function (speed) {

        // Rebound when the ball hit on the boundary
        if (ball.location.y + ball.height + direction.y * speed > boardHeight) {
            if (direction.y > 0) {
                direction.y *= -1;
            }
        }

        if (ball.location.y + direction.y * speed < 0) {
            if (direction.y < 0) {
                direction.y *= -1;
            }
        }

        ball.location.x += direction.x * speed;
        ball.location.y += direction.y * speed;
    }

    var keyPressedDowns = {};
    // events
    window.addEventListener('keydown', function(event) {
        keyPressedDowns[event.key] = true;
    });

    window.addEventListener('keyup', function(event) {
        keyPressedDowns[event.key] = false;
    });

    var keyActions = {};
    keyActions['a'] = function() {
        if (paddle.location.x - 10 < 0) {
            paddle.location.x = 0;
        } else {
            paddle.location.x -= 10;
        }

        log("move to left :" + paddle.location.x);
    };

    keyActions['d'] = function() {
        if (paddle.location.x + paddle.width + 10 > boardWidth) {
            paddle.location.x = boardWidth - paddle.width;
        } else {
            paddle.location.x += 10;
        }


        log("move to right :" + paddle.location.x);
    };

    paddle.onload = function() {
        paddle.location.y = boardHeight - paddle.height;

        gameBoardCanvasContext.drawImage(paddle, paddle.location.x, paddle.location.y);
        gameBoardCanvasContext.drawImage(ball,   ball.location.x, ball.location.y);
        var deamon = function() {
            for (var key in keyPressedDowns) {
                log("Daemon: " + key + " PressedDown: " + keyPressedDowns[key]);
                if ((key == 'a' || key == 'd') && keyPressedDowns[key]) {
                    keyActions[key]();
                    gameBoardCanvasContext.clearRect(0, 0, boardWidth, boardHeight);
                    gameBoardCanvasContext.drawImage(paddle, paddle.location.x, paddle.location.y);
                    gameBoardCanvasContext.drawImage(ball,   ball.location.x, ball.location.y);
                }
            }

            ball.move(10);
            gameBoardCanvasContext.clearRect(0, 0, boardWidth, boardHeight);
            gameBoardCanvasContext.drawImage(paddle, paddle.location.x, paddle.location.y);
            gameBoardCanvasContext.drawImage(ball,   ball.location.x, ball.location.y);
        };
        // timer
        setInterval(deamon, 1000 / 30);
    };
}

//# sourceMappingURL=srcipt.js