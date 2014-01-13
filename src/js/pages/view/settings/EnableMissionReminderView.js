/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var EnableMissionReminderView = widgetPages.EnableMissionReminderView = function(){
        this.inputName = 'enable-mission-reminder';
        this.title = "遠征完了通知を使う";
    };
    EnableMissionReminderView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    EnableMissionReminderView.prototype.constructor = EnableMissionReminderView;
})();
