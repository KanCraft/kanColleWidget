/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';
    var ShowOldLaunchView = widgetPages.ShowOldLaunchView = function(){
        this.inputName = 'show-old-launch';
        this.title = "古い(非推奨の)LAUNCHボタンを表示する";
    };
    ShowOldLaunchView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    ShowOldLaunchView.prototype.constructor = ShowOldLaunchView;
})();
