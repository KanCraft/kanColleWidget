/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var EnableSyncView = widgetPages.EnableSyncView = function(){
        this.inputName = 'enable-sync';
        this.title = "複数PC間のタイマーなどの同期をする";
        this.description = '艦これウィジェットに保存した遠征終了時刻などのデータを'
                         + '複数PCのChromeブラウザで同期できるようにします。仕組みは'
                         + '<a href="http://developer.chrome.com/extensions/storage">ここ</a>'
                         + '見てください。なお、これを有効にすると、'
                         + 'アイコンポップアップの中に[ sync load ]ボタンが表示されます。';
    };
    Util.extend(EnableSyncView, widgetPages.SettingCheckboxView);
})();
