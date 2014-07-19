/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var DisplayMaintenanceInfoView = widgetPages.DisplayMaintenanceInfoView = function(){
        this.inputName = 'display-maintenance-info';
        this.title = "運営電文を表示";
        this.description = '@KanColle_STAFFによるTweetを右上出したときに表示します';
    };
    Util.extend(DisplayMaintenanceInfoView, widgetPages.SettingCheckboxView);
})();
