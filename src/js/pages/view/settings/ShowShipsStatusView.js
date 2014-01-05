/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';

    var ShowShipsStatusView = widgetPages.ShowShipsStatusView = function(){
        this.inputName = 'show-ships-status';
        this.title = "進撃/撤退選択時に艦娘の状態を表示する";
        this.description = '<span class="description xsmall">大破進撃、ダメ。ゼッタイ。</sapn>';
    };
    ShowShipsStatusView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    ShowShipsStatusView.prototype.constructor = ShowShipsStatusView;
})();
