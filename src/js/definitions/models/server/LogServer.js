/* jshint indent: 4 */

/**
 * ログサーバとの接続をするクラス
 * @constructor
 */
function Log(){
    // デバグにはこのサーバURLをつかうこと！！！ServerBaseでurl.matchしてる！！
    // this.baseurl = 'http://log-kcwidget.oti10.com:7778';
    this.baseurl = 'http://log-kcwidget.oti10.com';
};
Log.prototype = new ServerBase(Constants);

/**
 * ログを送りつける
 * @param data
 * @param callback
 */
Log.prototype.send = function(data, callback){
    this.url = this.baseurl + '/ocr/upload';
    this._post(data, callback);
};

var kanColleWidget = kanColleWidget || {};
(function(){
    kanColleWidget.Log = new Log();
})();
