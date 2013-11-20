/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var ImageFormatView = widgetPages.ImageFormatView = function(){
        this.inputName = 'capture-image-format';
        this.elements = [
            {value:'png'},
            {value:'jpeg', title:'じぇーぺぐ'}
        ];
    };
    ImageFormatView.prototype = Object.create(widgetPages.SettingRadioButtonView.prototype);
    ImageFormatView.prototype.constructor = ImageFormatView;

    ImageFormatView.prototype.render = function(){
        this.apply({
            title : "スクショの画像フォーマット",
            description : ''
        }).listen()._render();
        this.renderInputs();
        return this.$el;
    };
})();
