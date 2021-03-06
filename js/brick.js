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
 * File     : brick.js
 * Date     : 2017/09/08.
 */

define(function() {
    var Brick = function(image, customColor, customLocation) {
        var width = image.width;
        var height = image.height;

        var color = customColor;
        var location = customLocation;
        var isExist = true;

        this.getColor = function () {
            return color;
        };

        this.getLocation = function () {
            return location;
        };

        this.getWidth = function () {
            return width;
        };

        this.getHeight = function () {
            return height;
        };

        this.getIsExist = function () {
            return isExist;
        };

        this.setIsExist = function (val) {
            isExist = val;
        }

        /*
         * Very simple and naive handler for collision.
         * unperfect but ... this is enough for current implementation.
         * The real collision in physics wil be more complicated.
         */
        this.collisionCheck = function(ball) {
            if (!isExist) {
                return;
            }

            var ballLocation = ball.getLocation();

            var conditionA =
                ballLocation.x > location.x &&
                ballLocation.x < (location.x + width) &&
                ballLocation.y <= (location.y + height);

            var conditionB =
                (ballLocation.x + ball.getWidth()) > location.x &&
                (ballLocation.x + ball.getWidth()) < (location.x + width) &&
                ballLocation.y <= (location.y + height);

            if (conditionA || conditionB) {
                isExist = false;               
                ball.reverseVerticalMoveDirection();
            }

        };

        this.draw = function (canvasContext) {
            canvasContext.fillStyle = color;
            canvasContext.fillRect(location.x, location.y, width, height);
        }
    }

    return Brick;
})