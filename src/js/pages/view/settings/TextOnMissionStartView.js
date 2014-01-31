/* jshint indent: 4 */
var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var TextOnMissionStartView = widgetPages.TextOnMissionStartView = function(){
        this.inputName = 'text-on-mission-start';
        this.title = "遠征出発時の文言";
    };
    TextOnMissionStartView.prototype = Object.create(widgetPages.SettingTextView.prototype);
    TextOnMissionStartView.prototype.constructor = TextOnMissionStartView;
})();
