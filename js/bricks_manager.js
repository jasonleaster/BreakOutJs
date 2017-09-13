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
 * File     : brick_manager.js
 * Date     : 2017/09/08.
 */

define(['js/brick', 'js/location'], function(Brick, LocationFactory) {

    var Manager = function() {
        var bricks = {
            rows: 4,
            cols: 6,
            container: []
        };
       
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

        function init(boardWidth) {

            for (var i = 0; i < bricks.rows; i++) {

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

                    var brick = new Brick({ width: brickWidth - 2, height: brickHeight - 2 },
                        brickColor,
                        LocationFactory(j * brickWidth, i * brickHeight));

                    containerInRow.push(brick);
                }
                bricks.container[i] = containerInRow;
            };
        }


        this.build = function(boardWidth, rowNum, colNum) {
            bricks.rows = rowNum;
            bricks.cols = colNum;
            bricks.counts = bricks.rows * bricks.cols;
            init(boardWidth);

            return bricks;
        }
    }


    return new Manager();
})