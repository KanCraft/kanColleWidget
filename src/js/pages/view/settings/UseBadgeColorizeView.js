/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var UseBadgeColorizeView = widgetPages.UseBadgeColorizeView = function(){
        this.inputName = 'use-badge-colorize';
        this.title = "バッジの色分けする";
        this.description = 'バッジの色が、遠征:緑、修復:青、建造:黄、疲労:白、になります <a href="https://pbs.twimg.com/media/BTJoojqCMAAqFy3.png"><img src="https://pbs.twimg.com/media/BTNXZaCCIAADciW.png" width="30px"></a>'
    };
    Util.extend(UseBadgeColorizeView, widgetPages.SettingCheckboxView);
})();
