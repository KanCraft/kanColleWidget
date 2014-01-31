/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var ModifyOriginalTabView = widgetPages.ModifyOriginalTabView = function(){
        this.inputName = 'modify-original-tab';
        this.title = "オリジナル窓も整形する";
        this.description = $('<span class="xsmall description">オリジナル窓でもゲーム領域が左上にぴったりくるようになります。オリジナルを整形するのは好きじゃない</span>');
    };
    ModifyOriginalTabView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    ModifyOriginalTabView.prototype.constructor = ModifyOriginalTabView;
})();
