/**
 * Author   : EOF
 * File     : image.js
 * Date     : 2017/09/08.
 */

define(function() {

    var ImageBuilder = function(filePath) {
        "use strict";
        var img = new Image();
        img.src = filePath;
        return img;
    };
    return ImageBuilder;
    
});

//# sourceMappingURL=js/image.js