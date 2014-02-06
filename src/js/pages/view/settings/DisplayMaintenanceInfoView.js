/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var DisplayMaintenanceInfoView = widgetPages.DisplayMaintenanceInfoView = function(){
        this.inputName = 'display-maintenance-info';
        this.title = "メンテナンス情報を表示する";
        this.description = '@KanColle_STAFFによるメンテナンス情報ツイートを表示します';
    };
    Util.extend(DisplayMaintenanceInfoView, widgetPages.SettingCheckboxView);
})();
