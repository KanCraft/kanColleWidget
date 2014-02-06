/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var ShowOldLaunchView = widgetPages.ShowOldLaunchView = function(){
        this.inputName = 'show-old-launch';
        this.title = "古いLAUNCHボタンを表示する";
        this.description = "従来の機能でも絶対に垢バンされない自信はありますが、それでも信じられない方々にはスピリチュアルな絶対安全モード「WHITEモード」をおすすめします";
    };
    Util.extend(ShowOldLaunchView, widgetPages.SettingCheckboxView);
})();
