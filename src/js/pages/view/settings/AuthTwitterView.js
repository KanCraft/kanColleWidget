/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var AuthTwitterView = widgetPages.AuthTwitterView = function(){
        this.inputName = 'auth-twitter';
        this.title = "スクショ撮った画像をツイッター連携で投稿する";
        this.description = 'チェックを入れるとツイッター連携確認の画面に飛びます';
    };
    Util.extend(AuthTwitterView, widgetPages.SettingCheckboxView);
})();
