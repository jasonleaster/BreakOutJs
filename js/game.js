/**
    MIT License

    Copyright (c) 2017 EOF

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

 * Author   : EOF
 * Email    : jasonleaster@gmail.com
 * File     : game.js
 * Date     : 2017/09/08.
 */

define(['jquery', 'js/paddle', 'js/ball', 'js/brick'], function($, Paddle, Ball, Brick) {

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
        var gameResult = "Win";
        var chanceLeft = 2;

        // how much score the user got in this game
        var score = 0;

        var boardWidth = 460;
        var boardHeight = 400;
        var boardBoundary = {
            width: { min: 0, max: boardWidth },
            height: { min: 0, max: boardHeight }
        };

        var abstractPaddle = {width:  150, height: 20};
        var abstractBall = {width:10, height:10};
        var paddle = new Paddle(abstractPaddle, LocationFactory(0, boardHeight - abstractPaddle.height), "#66D9EF");
        var balls = [
            new Ball(abstractBall, LocationFactory((boardWidth - abstractBall.width) / 2, 150), DirectionFactory(+1, +2), "black"),
            new Ball(abstractBall, LocationFactory((boardWidth - abstractBall.width) / 2, 150), DirectionFactory(-2, +1), "red"),
            //new Ball(abstractBall, LocationFactory((boardWidth - abstractBall.width) / 2, 150), DirectionFactory(+1, -1), "green"),
        ];
        var bricks = {
            rows: 4,
            cols: 6,
            container: []
        };
        bricks.counts = bricks.rows * bricks.cols;
        bricks.checkIfCollision = function(ball) {
            // check for bricks
            var totalBricks = bricks.rows * bricks.cols;
            var brickInstances = bricks.container;
            for (var i = 0; i < brickInstances.length; i++) {
                var bricksInRow = brickInstances[i];

                for (var j = 0; j < bricksInRow.length; j++) {
                    var brick = bricksInRow[j];

                    if (brick.getIsExist()) {
                        brick.collisionCheck(ball);
                    } else {
                        totalBricks--;
                    }
                }
            }
            bricks.counts = totalBricks;
        };

        for (var i = 0; i < bricks.rows; i++ ) {
            
            var containerInRow = bricks.container[i] || [];

            var brickColor;
            if (i == 0) {
                brickColor = '#2980b9';
            } else if (i == 1) {
                brickColor = '#27ae60';
            } else if (i == 2) {
                brickColor = '#ED8F03';
            } else {
                brickColor = '#e74c3c';
            }

            for (var j = 0; j < bricks.cols; j++) {
                var brickWidth = boardWidth / bricks.cols;
                var brickHeight = 20;

                var brick = new Brick(
                    {width: brickWidth - 2, height: brickHeight - 2}, 
                    brickColor, 
                    LocationFactory(j*brickWidth, i*brickHeight));

                containerInRow.push(brick);
            }
            bricks.container[i] = containerInRow;
        }

        var defaultPaddleSpeed = 20;
        var defaultBallSpeed = 5;

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

            paddle.draw(canvasContext);

            for (var i = 0; i < balls.length; i++) {
                var ball = balls[i];
                ball.draw(canvasContext);
            }

            var brickInstances = bricks.container;
            for (var i = 0; i < brickInstances.length; i++) {
                var bricksInRow = brickInstances[i];

                for (var j = 0; j < bricksInRow.length; j++) {
                    var brick = bricksInRow[j];

                    if (brick.getIsExist()) {
                       brick.draw(canvasContext);
                    }
                }
            }

            $(".instr").text("Score : " + score);
        }

        function checkIfGameOver() {
            var gameOver = false;

            if (bricks.counts == 0) {
                gameResult = "Win";
                return true;
            }

            for (var k = 0; k < balls.length; k++) {
                var ball = balls[k];
                var ballLocation = ball.getLocation();

                bricks.checkIfCollision(ball);

                if ((ballLocation.y + ball.getHeight()) < (boardHeight - paddle.getHeight())) {
                    gameOver = false; // redundant assignment with intention
                    continue;
                }
                var paddleLocation = paddle.getLocation();
                if (ballLocation.x > (paddleLocation.x + paddle.getWidth()) ||
                    (ballLocation.x + ball.getWidth()) < paddleLocation.x) {
                    gameOver = true;
                    gameResult = "Failed";
                    return gameOver;
                } else {
                    score += 10;
                    ball.reverseVerticalMoveDirection();
                }
            }
           
            return gameOver;
        }

        var deamon = function() {
            if (!(gameStatus === "Running")) {
                return;
            }

            var gameOver = checkIfGameOver();
            if (gameOver) {
                if (gameResult === "Win") {
                    modalPopup("Congradulations! You win the game!", "Good Job :)");
                } else {
                    if (chanceLeft > 0) {
                        $('.life .heart').eq(chanceLeft).addClass('heart-o');
                        chanceLeft -= 1;
                        gameStatus = "Failed";
                    } else {
                        modalPopup("You lose the game, why not try it again!", "That's a pity ... ");
                    }
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
            paddle.setLocation(LocationFactory(0, boardHeight - paddle.getHeight()));
            for (var i = 0; i < balls.length; i++) {
                var ball = balls[i];
                ball.setLocation(LocationFactory((boardWidth - ball.getWidth()) / 2, 150));
            }
            gameStatus = "Running";
        }

        this.restart = _restart;

        this.start = function() {
            // timer
            setInterval(deamon, 1000 / 20);
        }
    };

    return BreakOutGame;
});

//# sourceMappingURL=js/game.js