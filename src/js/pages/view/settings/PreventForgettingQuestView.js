/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var PreventForgettingQuestView = widgetPages.PreventForgettingQuestView = function(){
        this.inputName = 'prevent-forgetting-quest';
        this.title = "デイリー任務受け忘れ防止アラートを出す";
        this.description = '<span class="description xsmall"><b>1</b>.戦績表示するときに工廠が反応しちゃう <b>2</b>.改装は検知できない です</sapn>';
    };
    PreventForgettingQuestView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    PreventForgettingQuestView.prototype.constructor = PreventForgettingQuestView;
})();
