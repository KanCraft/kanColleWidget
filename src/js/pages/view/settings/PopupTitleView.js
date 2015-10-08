/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var PopupTitleView = widgetPages.PopupTitleView = function(){
        this.inputName = 'popup-select-title';
        this.title = '最初に出てくる文字';
        this.description = 'APPモード窓はデフォルトでは「艦これウィジェット」ですが、ここが設定された場合、APPモード窓のタイトルもこれにします。';
        this.placeholder = "提督仕事しろ";
        this.size = 50;
    };
    Util.extend(PopupTitleView, widgetPages.SettingTextView);
})();
