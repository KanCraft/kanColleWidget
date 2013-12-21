/* jshint indent: 4 */
var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    /**
     * OCRサーバとの接続をするクラス
     * @constructor
     */
    var Ocr = function(){
        this.baseurl = 'http://ocr-kcwidget.oti10.com';
    };
    Ocr.prototype = new KanColleWidget.ServerBase(Constants);
    /**
     * OCRサーバに画像処理を依頼する
     * @param imgURI
     * @param callback
     */
    Ocr.prototype.send = function(imgURI, callback){
        this.url = this.baseurl + '/upload';
        var data = {imgBin: imgURI};
        this._post(data, callback);
    };
    KanColleWidget.Ocr = new Ocr();
})();
