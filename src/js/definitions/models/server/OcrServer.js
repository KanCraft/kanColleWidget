/* jshint indent: 4 */
var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    /**
     * OCRサーバとの接続をするクラス
     * @constructor
     */
    var Ocr = function(){
        // this.baseurl = 'http://ocr-kcwidget.oti10.com';
        this.baseurl = 'http://ocr-kcwidget.herokuapp.com'
    };
    Ocr.prototype = new KanColleWidget.ServerBase(Constants);
    /**
     * OCRサーバに画像処理を依頼する
     * @param imgURI
     * @param callback
     */
    Ocr.prototype.send = function(imgURI, callback){
        this.url = this.baseurl + '/base64';
        // var data = {imgBin: imgURI};
        var data = {
          base64: imgURI.split(",")[1],
          whitelist: ":0123456789",
          trim: "\n"
        };
        this._post(data, callback);
    };
    KanColleWidget.Ocr = new Ocr();
})();
