/* jshint indent: 4 */

var Process = Process || {};

(function(){
    'use strict';

    /**
     * 画面キャプチャから時間を検出する
     * @constructor
     */
    var DetectTime = Process.DetectTime = function(chrome,
                                                   constants,
                                                   config) {
        this.chrome    = chrome;
        this.constants = constants;
        this.config    = config;
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
            if(localStorage.isDebug == 'true'){
                var trimmedImg = new Image();
                trimmedImg.src = trimmedURI;
                var win = window.open();
                win.document.title = new Date().toLocaleDateString();
                win.document.body.appendChild(trimmedImg);
            }

            // OCRサーバへ送る
            kanColleWidget.Ocr.send(trimmedURI, function(res){
                res.imgURI      = trimmedURI;
                res.createdTime = Date.now();
                res.userAgent   = navigator.userAgent;
                res.rawText     = res.result;
                res.assuredText = self._assure(res.result);
                res.result      = self._isSucceeded(res.assuredText);
                res.extVer      = self.chrome.app.getDetails().version;

                // Logサーバへ送る
                console.log(res);
                if(self.config.get('allow-ocr-result-log')) {
                    kanColleWidget.Log.send(res, function(){/* */});
                }

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
        var screen = {width:wholeImage.width, height:wholeImage.height};
        var aspect = 0.6;
        var blank = {top:0, left:0, height:0, width:0};
        if (screen.height / screen.width < aspect) {
            blank.width = screen.width - (screen.height / aspect);
            blank.left = blank.width / 2;
        } else {
            blank.height = screen.height - (screen.width * aspect);
            blank.top = blank.height / 2;
        }
        var content = {width:(screen.width - blank.width), height:(screen.height - blank.height)};
        var res = {
            size : {
                width  : map[purpose].size.width  * content.width,
                height : map[purpose].size.height * content.width
            },
            coords : {
                left : map[purpose].coords[arrayIndex].left * content.width + blank.left,
                top  : map[purpose].coords[arrayIndex].top  * content.width + blank.top
            }
        };
        return res;
    };

    DetectTime.prototype._isSucceeded = function(resultString) {
        var match = resultString.match(/([0-9]{2}):([0-9]{2}):([0-9]{2})/);
        if(!match || match.length < 4) { return false; }
        return true;
    };
})();
