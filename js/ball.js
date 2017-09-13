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
 * File     : ball.js
 * Date     : 2017/09/08.
 */

define(function() {

    var Ball = function (ballImage, customLocation, customDirection, customColor) {
        var image = ballImage;
        var width = image.width;
        var height = image.height;
        var color = customColor;
        var location = customLocation;
        var direction = customDirection;

        this.getImage = function() {
            return image;
        };

        this.getWidth = function() {
            return width;
        };
        this.getHeight = function() {
            return height;
        };
        this.getLocation = function() {
            return location;
        };
        this.setLocation = function(customLocation) {
            location = customLocation;
        };

        this.getColor = function () {
            return color;
        };

        this.getDirection = function () {
            return direction;
        };

        this.reverseVerticalMoveDirection = function () {
            direction.y *= -1;
        };

        this.reverseHorizonMoveDirection = function () {
            direction.x *= -1;
        };

        this.draw = function (canvasContext) {
            canvasContext.beginPath();
            canvasContext.fillStyle = color;
            canvasContext.arc(location.x, location.y, 10, 0, 2 * Math.PI, true);
            canvasContext.fill();
            canvasContext.closePath();
        };

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
        };
    };

    return Ball;
});

//# sourceMappingURL=js/ball.js