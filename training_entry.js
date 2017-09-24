/**
 * Author   : EOF
 * File     : training_entry.js
 * Date     : 2017/09/17.
 */

requirejs.config({
    baseUrl: './',
    paths: {
        "js": 'js',
        "libs": 'libs',
        'jquery': 'libs/jquery.min',
    }
});


require(['libs/domReady', 'js/ai/training'], function(_, TrainingModule) {
    var trainingModule = new TrainingModule();
    trainingModule.training();
});