/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var DisplayMaintenanceInfoView = widgetPages.DisplayMaintenanceInfoView = function(){
        this.inputName = 'display-maintenance-info';
        this.title = "メンテナンス情報を表示する";
        this.description = $('<span class="xsmall description"></span>');
        this.description.html('@KanColle_STAFFによるメンテナンス情報ツイートを表示します');
    };
    DisplayMaintenanceInfoView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    DisplayMaintenanceInfoView.prototype.constructor = DisplayMaintenanceInfoView;
})();
