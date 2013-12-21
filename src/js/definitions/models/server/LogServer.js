/* jshint indent: 4 */
var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    /**
     * ログサーバとの接続をするクラス
     * @constructor
     */
    var Log = function(){
        // デバグにはこのサーバURLをつかうこと！！！ServerBaseでurl.matchしてる！！
        // this.baseurl = 'http://log-kcwidget.oti10.com:7778';
        this.baseurl = 'http://log-kcwidget.oti10.com';
    };
    Log.prototype = new KanColleWidget.ServerBase(Constants);
    /**
     * ログを送りつける
     * @param data
     * @param callback
     */
    Log.prototype.send = function(data, callback){
        this.url = this.baseurl + '/ocr/upload';
        this._post(data, callback);
    };
    KanColleWidget.Log = new Log();
})();
