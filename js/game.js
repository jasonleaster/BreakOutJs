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

define(['jquery', 'js/paddle', 'js/ball', 'js/bricks_manager', 'js/location'], 
    function($, Paddle, Ball, BrickManager, LocationFactory) {

    function modalPopup(message, header) {
        $('.modal-message').text(message);
        $('.modal-box h3').text(header);

        setTimeout(function() {
            $('.modal-overlay').show();
            $('body').addClass('game-over');
        }, 100);
    }

    var DirectionFactory = LocationFactory;

    // degree of difficulty
    var BreakOutGame = function(config) {
        "use strict";
        var debugMode = true;
        var gameStatus = "UnStart"; // UnStart, Running, Finished
        var gameResult = "Win";     // Win, Finished
        var unstarted = true;
        var chanceLeft = 2;
        var deamonId;

        // how much score the user got in this game
        var score = 0;

        var boardWidth = 460;
        var boardHeight = 400;
        var boardBoundary = {
            width: { min: 0, max: boardWidth },
            height: { min: 0, max: boardHeight }
        };

        var abstractPaddle = {width: 150, height: 20}; 
        var abstractBall   = {width: 10,  height: 10};
        var paddle = new Paddle(abstractPaddle, LocationFactory(0, boardHeight - abstractPaddle.height), "#66D9EF");
        var balls = [
            new Ball(abstractBall, LocationFactory((boardWidth - abstractBall.width) / 2, 150), DirectionFactory(+1, +2), "black"),
            // new Ball(abstractBall, LocationFactory((boardWidth - abstractBall.width) / 2, 150), DirectionFactory(-2, +1), "red"),
            //new Ball(abstractBall, LocationFactory((boardWidth - abstractBall.width) / 2, 150), DirectionFactory(+1, -1), "green"),
        ];
        var bricks = BrickManager.build(boardWidth, 4, 6);

        var defaultPaddleSpeed = 20;
        var defaultBallSpeed = 5;

        var gameBoardCanvas = document.getElementById('gameBoard');
        gameBoardCanvas.width = boardWidth;
        gameBoardCanvas.height = boardHeight;

        var dragging = false;
        var selectedBall;
        // add mousedown event handler
        gameBoardCanvas.onmousedown = function(event) {
            if (debugMode) {
                var x = event.layerX;
                var y = event.layerY;
                for (var i = 0; i < balls.length; i++) {
                    var ballLocation = balls[i].getLocation();
                    if (Math.abs(ballLocation.y - y) + Math.abs(ballLocation.x - x) < balls[i].getWidth()) {
                        dragging = true;
                        selectedBall = balls[i];
                        return;
                    }
                }
            }
        };

        // add mouseup event handler
        gameBoardCanvas.onmouseup = function(event) {
            if (debugMode) {
                var x = event.layerX;
                var y = event.layerY;
                if (dragging) {
                    dragging = false;
                    selectedBall.setLocation(LocationFactory(x, y));
                }
            }
        };

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

        function _gameOver () {
            return gameStatus == "Finished";
        }

        function _gameStarted() {
            return gameStatus != "UnStart";
        }

        this.isGameOver = function () {
            return _gameOver();
        };

        var deamon = function() {
            // check if game have started or game over
            if (!_gameStarted() || _gameOver()) {
                return;
            }

            var gameOver = checkIfGameOver();
            if (gameOver) {
                gameStatus = "Finished";

                if (gameResult === "Win") {
                    modalPopup("Congradulations! You win the game!", "Good Job :)");
                    clearInterval(deamonId);
                } else {
                    if (chanceLeft > 0) {
                        $('.life .heart').eq(chanceLeft).addClass('heart-o');
                        chanceLeft -= 1;
                    } else {
                        clearInterval(deamonId);
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
            paddle.setLocation(LocationFactory((boardWidth - paddle.getWidth())/2, boardHeight - paddle.getHeight()));
            for (var i = 0; i < balls.length; i++) {
                var ball = balls[i];
                ball.setLocation(LocationFactory((boardWidth - ball.getWidth()) / 2, 150));
            }
            gameStatus = "Running";
        }

        this.restart = _restart;

        this.start = function() {
            // first time to refresh screen
            refreshScreen(gameBoardCanvasContext);

            // timer
            deamonId = setInterval(deamon, 1000 / 20);
        };

        // expose API for player
        this.movePaddleLeft = function () {
            paddle.moveLeft(defaultPaddleSpeed, boardBoundary);
        };
        this.movePaddleRight = function () {
            paddle.moveRight(defaultPaddleSpeed, boardBoundary);
        };
        this.getUserScore = function () {
            return score;
        };
        this.getBalls = function () {
            return balls;
        };
        this.getPaddle = function () {
            return paddle;
        };
        this.activeGame = function () {
            gameStatus = "Running";
        }
    };

    return BreakOutGame;
});

//# sourceMappingURL=js/game.js