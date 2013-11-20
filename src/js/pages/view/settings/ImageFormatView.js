/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var ImageFormatView = widgetPages.ImageFormatView = function(){
        this.inputName = 'capture-image-format';
        this.title = "スクショの画像フォーマット";
        this.elements = [
            {value:'png'},
            {value:'jpeg', title:'じぇーぺぐ'}
        ];
    };
    ImageFormatView.prototype = Object.create(widgetPages.SettingRadioButtonView.prototype);
    ImageFormatView.prototype.constructor = ImageFormatView;
})();
