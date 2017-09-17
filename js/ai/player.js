define(['game'], function(Game) {
    var Player = function(playerName) {
        var name = playerName;
        var breakOutGame = new Game();
        var brain;

        this.startGame = function (argument) {
            breakOutGame.start();
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
        }
    }

    return Player;
});