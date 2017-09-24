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
 * File     : paddle.js
 * Date     : 2017/09/08.
 */

define(function() {

    var Paddle = function(paddleImage, customLocation, customColor) {
        var image = paddleImage;
        var width = image.width;
        var height = image.height;
        var color = customColor;
        var location = customLocation;

        this.getImage = function() {
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

        this.getColor = function () {
            return color;
        }

        this.setLocation = function(customLocation) {
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
                location.x = boundary.width.max - width;
            } else {
                location.x += speed;
            }
        };

        this.draw = function (canvasContext) {
            canvasContext.beginPath();
            canvasContext.fillStyle = color;
            canvasContext.fillRect(location.x, location.y, width, height);
            canvasContext.closePath();
        };

        this.basicInfoToVector = function (){
            return [location.x, location.y];
        };
    };

    return Paddle;
});

//# sourceMappingURL=js/paddle.js