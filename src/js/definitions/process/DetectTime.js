/* jshint indent: 4 */

var Process = Process || {};

(function(){
    'use strict';

    /**
     * 画面キャプチャから時間を検出する
     * @constructor
     */
    var DetectTime = Process.DetectTime = function(chrome,
                                                   constants) {
        this.chrome    = chrome;
        this.constants = constants;
    };

    /**
     * 建造にかかる時間を検出する
     * @param windowId
     * @param api_kdock_id
     * @param callback
     */
    DetectTime.prototype.forCreateship = function(windowId,
                                                  api_kdock_id,
                                                  callback) {
        var purpose = 'createship';
        this._detect(windowId, purpose, api_kdock_id, callback);
    };

    /**
     * 入渠にかかる時間を検出する
     * @param windowId
     * @param api_ndock_id
     * @param callback
     */
    DetectTime.prototype.forNyukyo = function(windowId,api_ndock_id,callback) {
        var purpose = 'nyukyo';
        this._detect(windowId, purpose, api_ndock_id, callback);
    }

    /**
     * 目的とドックidを受け取って時間を決定して返す
     * @param windowId
     * @param purpose
     * @param dockId
     * @param callback
     * @private
     */
    DetectTime.prototype._detect = function(windowId,
                                            purpose,
                                            dockId,
                                            callback) {
        var self = this;
        this.chrome.tabs.captureVisibleTab(windowId, {'format':'png'}, function(dataURI){

            // トリミングする
            var trimmedURI = self._trim(dataURI, purpose, dockId);

            // デバッグモードならトリミング後の画像を出す
            if(localStorage.isDebug === true){
                var trimmedImg = new Image();
                trimmedImg.src = trimmedURI;
                var win = window.open();
                win.document.title = new Date().toLocaleDateString();
                win.document.body.appendChild(trimmedImg);
            }

            // OCRサーバへ送る
            kanColleWidget.Ocr.send(trimmedURI, function(res){
                res.result = self._assure(res.result);
                res.dataURI = dataURI;
                callback(res);
            });
        });
    };

    /**
     * サーバ返答の文字列を適当な文字列に推測して置換して返す
     * @param str
     * @returns {*}
     * @private
     */
    DetectTime.prototype._assure = function(str){
        if(typeof(str) !== 'string') { str = ''; }

        var map = this.constants.assuranceStringMap;
        for(var vagueString in map){
            if(map.hasOwnProperty(vagueString)) {
                var regex = new RegExp(vagueString, 'g');
                str = str.replace(regex, map[vagueString]);
            }
        }
        if(str === '00200200') { str = '00:00:00'; }
        return str;
    };

    /**
     * 画面全体の画像から時間表示領域だけを切り取って返す
     * @param dataURI
     * @param purpose
     * @param dockId
     * @returns {string}
     * @private
     */
    DetectTime.prototype._trim = function(dataURI,
                                          purpose,
                                          dockId) {
        var img = new Image();
        img.src = dataURI;

        var params = this._trimmingCoordsAndSize(img, purpose, dockId);

        var canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = params.size.width;
        canvas.height = params.size.height;
        var ctx = canvas.getContext('2d');

        ctx.drawImage(
            img,
            params.coords.left,
            params.coords.top,
            params.size.width,
            params.size.height,
            0, // offset left in destination Image
            0, // offset top in destination Image
            canvas.width,
            canvas.height
        );

        // トリミングした画像を PNG32 から PNG24 に変換する
        var png24 = new CanvasTool.PngEncoder(canvas, {
            colourType: CanvasTool.PngEncoder.ColourType.TRUECOLOR
        }).convert();

        return 'data:image/png;base64,' + btoa(png24);
    };

    /**
     * 時間表時領域の座標と大きさを決定して返す
     * @param wholeImage
     * @param purpose
     * @param dockId
     * @returns {{size: {width: number, height: number}, coords: {left: number, top: number}}}
     * @private
     */
    DetectTime.prototype._trimmingCoordsAndSize = function(wholeImage,
                                                           purpose,
                                                           dockId){
        var map = this.constants.trimmingParamsMapping;
        var arrayIndex = +dockId - 1;
        var res = {
            size : {
                width  : map[purpose].size.width  * wholeImage.width,
                height : map[purpose].size.height * wholeImage.width
            },
            coords : {
                left : map[purpose].coords[arrayIndex].left * wholeImage.width,
                top  : map[purpose].coords[arrayIndex].top  * wholeImage.width
            }
        };
        return res;
    };
})();