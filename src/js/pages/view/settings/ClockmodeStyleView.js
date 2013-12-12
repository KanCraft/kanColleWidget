/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var ClockmodeStyleView = widgetPages.ClockmodeStyleView = function(){
        this.inputName = 'clockmode-style';
        this.title = "クロックモードのレイアウト";
        this.elements = [
            {value:'0', title: '一覧表示', description: '縦にずらー'},
            {value:'1', title: 'タグ表示', description: 'タグきりかえできる感じ'}
        ];
    };
    ClockmodeStyleView.prototype = Object.create(widgetPages.SettingRadioButtonView.prototype);
    ClockmodeStyleView.prototype.constructor = ClockmodeStyleView;
})();
