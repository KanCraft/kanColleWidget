/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var SyncMultiDevicesView = widgetPages.SyncMultiDevicesView = function(){
        this.inputName = 'sync-multi-devices';
        this.title = "複数PCでウィジェットのデータを同期する";
        this.description = '複数窓って意味じゃないです';
    };
    Util.extend(SyncMultiDevicesView, widgetPages.SettingCheckboxView);
})();
