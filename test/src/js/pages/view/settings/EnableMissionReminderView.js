/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var EnableMissionReminderView = widgetPages.EnableMissionReminderView = function(){
        this.inputName = 'enable-mission-reminder';
        this.title = "遠征リマインダー登録を有効にする";
    };
    EnableMissionReminderView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    EnableMissionReminderView.prototype.constructor = EnableMissionReminderView;
})();
