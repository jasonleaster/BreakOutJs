/**
 * Author   : EOF
 * File     : paddle.js
 * Date     : 2017/09/08.
 */

define(function() {

    var Paddle = function(paddleImage, customLocation) {
        var image = paddleImage;
        var width = image.width;
        var height = image.height;
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
                location.x = boundary.width.max - paddle.width;
            } else {
                location.x += speed;
            }
        };
    };

    return Paddle;
});

//# sourceMappingURL=js/paddle.js