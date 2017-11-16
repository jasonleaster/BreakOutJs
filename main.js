/**
 * Author   : EOF
 * File     : main.js
 * Date     : 2017/09/03.
 */

requirejs.config({
    baseUrl: './',

    /*
      paths用于映射不位于baseUrl下的模块名
    */
    paths: {
        "js": 'js',
        "libs": 'libs',
        'jquery': 'libs/jquery.min',
    }

    /*
        TODO 使用shim属性引入bootstrap等不支持AMD的模块
    */
});

/*
 * Make sure that the images have been loaded.
 */
require(['libs/domReady', 'js/game'], function(_, BreakOutGame) {
    var breakOutGame = new BreakOutGame();
    breakOutGame.start();
});