/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var TimerFormatRemainedTimeView = widgetPages.TimerFormatRemainedTimeView = function(){
        this.inputName = 'timer-format-remained-time';
        this.title = "リマインダーの時間表示は「のこり時間」にして";
    };
    Util.extend(TimerFormatRemainedTimeView, widgetPages.SettingCheckboxView);
})();
