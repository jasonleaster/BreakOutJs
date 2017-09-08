/**
 * Author   : EOF
 * File     : game.js
 * Date     : 2017/09/08.
 */

define(['jquery', 'js/paddle', 'js/ball'], function($, Paddle, Ball) {

    function modalPopup(message, header) {
        $('.modal-message').text(message);
        $('.modal-box h3').text(header);

        setTimeout(function() {
            $('.modal-overlay').show();
            $('body').addClass('game-over');
        }, 100);
    }

    var LocationFactory = function(xVal, yVal) {
        return { x: xVal, y: yVal };
    }
    var DirectionFactory = LocationFactory;

    // degree of difficulty
    var BreakOutGame = function(config) {
        "use strict";
        var gameStatus = "UnStart";
        var chanceLeft = 2;

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
            new Ball(imgBall, LocationFactory((boardWidth - imgBall.width) / 2, 0), DirectionFactory(+1, +2)),
            new Ball(imgBall, LocationFactory((boardWidth - imgBall.width) / 2, 0), DirectionFactory(-2, +1))
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
            if (!(gameStatus === "Running")) {
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
                if ((key == 'a' || key == 'd' || key == "ArrowLeft" || key == "ArrowRight") &&
                    keyPressedDowns[key]) {
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

        var _restart = function() {
            paddle.setLocation(LocationFactory(0, boardHeight - imgPaddle.height));
            for (var i = 0; i < balls.length; i++) {
                var ball = balls[i];
                ball.setLocation(LocationFactory((boardWidth - imgBall.width) / 2, 0));
            }
            gameStatus = "Running";
        }

        this.restart = _restart;

        this.start = function() {
            // timer
            setInterval(deamon, 1000 / 30);
        }
    };

    return BreakOutGame;
});

//# sourceMappingURL=js/game.js