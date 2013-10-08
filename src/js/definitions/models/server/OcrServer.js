/* jshint indent: 4 */

/**
 * OCRサーバとの接続をするクラス
 * @constructor
 */
function Ocr(){
    this.baseurl = 'http://ocr-kcwidget.oti10.com';
};
Ocr.prototype = new ServerBase(Constants);

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

var kanColleWidget = kanColleWidget || {};
(function(){
    kanColleWidget.Ocr = new Ocr();
})();
