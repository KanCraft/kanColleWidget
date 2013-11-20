/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var AllowOcrResultLogView = widgetPages.AllowOcrResultLogView = function(){
        this.inputName = 'allow-ocr-result-log';
        this.title = "自動取得失敗レポートを送信する";
        this.description = $('<span></span>');
        this.description.html('送信されたログは<a>ここ</a>から閲覧・削除できます');
        this.description.find('a').attr({
            href : 'http://log-kcwidget.oti10.com/ocr'
        });
        this.description.addClass('description xsmall');
    };
    AllowOcrResultLogView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    AllowOcrResultLogView.prototype.constructor = AllowOcrResultLogView;
})();
