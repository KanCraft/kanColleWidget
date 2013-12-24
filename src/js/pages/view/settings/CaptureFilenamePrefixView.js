/* jshint indent: 4 */
var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var CaptureFilenamePrefixView = widgetPages.CaptureFilenamePrefixView = function(){
        this.inputName = 'capture-image-filename-prefix';
        this.title = "スクショのファイル名プレフィックス";
        this.description = '{ここで設定した文字}_{日付}_{時間}.jpegとかになります';
    };
    CaptureFilenamePrefixView.prototype = Object.create(widgetPages.SettingTextView.prototype);
    CaptureFilenamePrefixView.prototype.constructor = CaptureFilenamePrefixView;
    CaptureFilenamePrefixView.prototype.validate = function(val){
        if (false) {
            return "うんこ";
        }
        return true;
    };
})();
