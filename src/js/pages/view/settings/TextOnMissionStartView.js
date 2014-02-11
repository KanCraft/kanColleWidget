/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var TextOnMissionStartView = widgetPages.TextOnMissionStartView = function(){
        this.inputName = 'text-on-mission-start';
        this.title = "遠征出発時の文言";
    };
    Util.extend(TextOnMissionStartView, widgetPages.SettingTextView);
})();
