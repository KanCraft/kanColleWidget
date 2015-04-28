/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var AskBeforeWindowCloseView = widgetPages.AskBeforeWindowCloseView = function(){
        this.inputName = 'ask-before-window-close';
        this.title = "ウィンドウを閉じる前に確認する";
        this.description = 'ウィンドウクローズやページ遷移の前に確認ダイアログを出します。変更したらウィンドウを開き直してください。';
    };
    Util.extend(AskBeforeWindowCloseView, widgetPages.SettingCheckboxView);
})();
