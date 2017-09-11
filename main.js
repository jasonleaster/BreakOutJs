/**
 * Author   : EOF
 * File     : main.js
 * Date     : 2017/09/03.
 */

requirejs.config({
    baseUrl: './',
    paths: {
        "js": 'js',
        "libs": 'libs',
        'jquery': 'libs/jquery.min',
    }
});

/*
 * Make sure that the images have been loaded.
 */
require(['libs/domReady', 'js/game'], function(_, BreakOutGame) {
    var breakOutGame = new BreakOutGame();
    breakOutGame.start();
});