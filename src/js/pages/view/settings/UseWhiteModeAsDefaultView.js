/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var UseWhiteModeAsDefaultView = widgetPages.UseWhiteModeAsDefaultView = function(){
        this.inputName = 'use-white-mode-as-default';
        this.title = "デフォルトでWHITEモードを使う";
        this.description = '通知を押したときの挙動が変わります';
    };
    Util.extend(UseWhiteModeAsDefaultView, widgetPages.SettingCheckboxView);
})();
