/* jshint indent: 4 */
var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var DownloadDirectoryView = widgetPages.DownloadDirectoryView = function(){
        this.inputName = 'capture-image-download-dir';
        this.title = "スクショのファイル名保存フォルダ";
        this.description = 'Download/{ここで指定したディレクトリ}/{先に指定したファイル名}.{指定した拡張子}となります';
    };
    DownloadDirectoryView.prototype = Object.create(widgetPages.SettingTextView.prototype);
    DownloadDirectoryView.prototype.constructor = DownloadDirectoryView;
    DownloadDirectoryView.prototype.validate = function(val){
        if (val.match(/[(\\|/|:|\*|?|\"|<|>|\|)]/)) {
            return "\\ / : * ? \" ' < > | 、このへんの文字列はファイル名に使えないっぽい？";
        }
        return true;
    };
})();
