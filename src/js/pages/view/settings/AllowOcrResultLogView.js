/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var AllowOcrResultLogView = widgetPages.AllowOcrResultLogView = function(){
        this.inputName = 'allow-ocr-result-log';
        this.title = "自動取得失敗レポートを送信する";
        this.description = '送信されたログは'
                         + '<a href="http://log-kcwidget.oti10.com/ocr">ここ</a>'
                         + 'から閲覧・削除できます';
    };
    Util.extend(AllowOcrResultLogView, widgetPages.SettingCheckboxView);
})();
