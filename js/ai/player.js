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
 * File     : player.js
 * Date     : 2017/09/24.
 */


define(['js/game'], function(Game) {
    var Player = function(playerName) {
        var player = this;
        var name = playerName;
        var breakOutGame = new Game();
        var gameOver = false;
        var deamonId;
        var gameEndHandler;
        var brain;

        var deamon = function () {
            if (breakOutGame.isGameOver()) {
                clearInterval(deamonId);
                gameOver = true;
                gameEndHandler();
                return;
            }
            debugger;
            // 1. get the location of ball and paddle
            var balls = breakOutGame.getBalls();
            var paddle = breakOutGame.getPaddle();
            // 2. input the information into the decision system

            // 3. the system will output the action of current environment
            var output = balls[0].getLocation().x - (paddle.getLocation().x + paddle.getWidth()/2);
            if (output < 0) {
                breakOutGame.movePaddleLeft();
            } else if (output > 0) {
                breakOutGame.movePaddleRight();
            } else {
                // do nothing. Don't need to move paddle
            }
        };

        this.playGame = function (next) {
            gameEndHandler = next;
            breakOutGame.start();
            deamonId = setInterval(deamon, 100);
        };

        this.movePaddleLeft = function() {
            breakOutGame.movePaddleLeft();
        };

        this.movePaddleRight = function() {
            breakOutGame.movePaddleRight();
        };
        this.getScore = function() {
            return breakOutGame.getUserScore();
        };
        this.gameOver = function () {
            return breakOutGame.isGameOver();
        };

        this.getPlayerName = function () {
            return name;
        };
    }

    return Player;
});