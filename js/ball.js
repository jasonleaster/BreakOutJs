/**
 * Author   : EOF
 * File     : ball.js
 * Date     : 2017/09/08.
 */

define(function() {

    var Ball = function (ballImage, customLocation, customDirection) {
        var image = ballImage;
        var width = image.width;
        var height = image.height;
        var location = customLocation;
        var direction = customDirection;

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
        }
    };

    return Ball;
});

//# sourceMappingURL=js/ball.js