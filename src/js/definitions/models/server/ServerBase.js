/* jshint indent: 4 */

/**
 * サーバ通信する基底クラス
 * @param constants {Object} src/js/Constants.js
 */
var ServerBase = function (constants) {
    this.constants = constants;
};

/**
 * サーバにPOSTを送る
 * @param dict
 * @param callback
 * @protected
 */
ServerBase.prototype._post = function(dict, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.url);

    var self = this;
    xhr.addEventListener('load', function() {

        if(xhr.status !== 200) {
            // これココ？
            alert(
                'server : ' + self.url + '\n' +
                'status : ' + xhr.status + '\n' +
                'text : ' + xhr.statusText + ',サーバエラーっぽい');
            return;
        }

        var response = JSON.parse(xhr.response);
        response.status = xhr.status;
        return callback(response);
    });

    // TODO : Flaskサーバはx-www-form-urlencodeをdecodeする必要がある
    // TODO : とりあえず今はこちらからencodeせずに送る
    // FIXME: うんこーど
    if (this.url.match('log-kcwidget')) {
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
    }
    xhr.send(this.dict2ParamStr(dict));
};

/**
 * 辞書型をポストパラメータ文字列に変換する
 * @param dict
 * @returns {string}
 */
ServerBase.prototype.dict2ParamStr = function(dict){
    var params = [];
    for(var name in dict){
        if(dict.hasOwnProperty(name)) {
            var value = dict[name];
            var param = encodeURIComponent( name ).replace( /%20/g, '+' )
                + '=' + encodeURIComponent( value ).replace( /%20/g, '+' );
            params.push( param );
        }
    }
    return params.join( '&' );
};
