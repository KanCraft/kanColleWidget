/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var PreventForgettingQuestView = widgetPages.PreventForgettingQuestView = function(){
        this.inputName = 'prevent-forgetting-quest';
        this.title = "デイリー任務受け忘れ防止アラートを出す";
    };
    PreventForgettingQuestView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    PreventForgettingQuestView.prototype.constructor = PreventForgettingQuestView;
})();
