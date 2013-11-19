/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var ImageFormatView = widgetPages.ImageFormatView = function(){
        this.inputName = 'capture-image-format';
        this.elements = ['png', 'jpeg'];
    };
    ImageFormatView.prototype = Object.create(widgetPages.SettingRadioButtonView.prototype);
    ImageFormatView.prototype.constructor = ImageFormatView;

    ImageFormatView.prototype.render = function(){
        this.apply({title : "スクショの画像フォーマット"})._render();
        this.renderInputs();
        return this.$el;
    };
})();
