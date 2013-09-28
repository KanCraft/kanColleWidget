/* jshint browser:true, indent: 4 */
/* global chrome, Constants, Tracking, Config, webkitNotifications, MyStorage, CanvasTool */
/**
 * dependency: MyStorage
 */

// Util が存在しなければオブジェクトとして初期化
var Util = Util || {};

(function() {
    'use strict';

    /**
     * 艦これウィジェットを起動する。
     * すでに起動済みの場合は、そちらにフォーカスする。
     * また、指定したサイズに変更も行う。
     * 終わったあとは callback の呼び出しを行う
     * @param mode {String} ウィジェットサイズ l, m, s, xs
     * @param callback {Function} Callback function
     */
    Util.focusOrLaunchIfNotExists = function(mode, callback) {
        if(typeof(callback) !== 'function') { callback = function(){/* do nothing */}; }

        // どのサイズにするのか
        var width = '800';
        for(var key in Constants.widget.width) {
            if(Constants.widget.width[key].mode === mode) {
                width = key;
                break;
            }
        }

        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow) {
            Util.focusKCWidgetWindow(widgetWindow);
            // `num | 0` is transform integer idiom.
            callback(widgetWindow, width | 0);
            return;
        }, function() {
            var pos = Tracking.get('widget').position;
            var options = 'width={w},height={h},location=no,toolbar=no,menubar=no,status=no,scrollbars=no,resizable=no,left={l},top={t}'
                    .replace('{w}', width + '')
                    .replace('{h}', (width * Constants.widget.aspect) + '')
                    .replace('{l}', pos.left + '')
                    .replace('{t}', pos.top + '');
            var kanColleUrl = 'https://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/?mode='+mode;
            window.open(kanColleUrl, '_blank', options);
            callback();
        });
    };

    /**
     * public notificationを作ってイベントバインドしたうえでshowする
     * ここに来るときは既にnotificationすべきかどうかの判定が済んでいるものとする
     * @return void
     */
    Util.presentation = function(text, opt) {
        // check options
        if(typeof(opt)          !== 'object')   { opt = {}; }
        if(typeof(opt.callback) !== 'function') { opt.callback = function(){/* do nothing */}; }
        if(typeof(opt.sound)    !== 'boolean')  { opt.sound = true; }

        // Chrome のバージョン的に 通知できない場合
        if(Util.system.getChromeVersion() < 28) {
            alert(text);
            opt.callback();
            return;
        }

        var default_url = chrome.extension.getURL('/') + Constants.notification.img;
        var iconUrl = Config.get('notification-img-file') || default_url;
        if(opt && opt.iconUrl) { iconUrl = opt.iconUrl; }
        var title = Constants.notification.title;
        var notificationParams = {
            type    : 'basic',
            title   : title,
            message : text,
            iconUrl : iconUrl
        };
        // 指定があれば音声を再生
        var url = Config.get('notification-sound-file');
        if(url && opt.sound){
            var audio = new Audio(url);
            if(Config.get('notification-sound-volume')){
                audio.volume = Config.get('notification-sound-volume') / 100;
            }
            audio.play();
        }

        if(Config.get('notification-stay-visible')) {
            var notification = webkitNotifications.createNotification(iconUrl, title, text);
            if(!Config.get('launch-on-click-notification')) { notification.show(); return; }
            notification.addEventListener('click', function() {
                Util.focusOrLaunchIfNotExists(Tracking.get('mode'));
            });
            notification.show();
        } else {
            chrome.notifications.create(String((new Date()).getTime()), notificationParams, function(){ opt.callback(); });
        }

        opt.callback();
    };

    /**
     * バッジ関連の設定
     */
    Util.badge = {
        clear : function(){
            Util.badge._text('');
        },
        increment : function(num){
            // null and undefined check idiom
            if(num == null) { num = 1; }

            chrome.browserAction.getBadgeText({}, function(val) {
                if(val === '') { val = 0; }
                // +num is transform to number idiom.
                // + '' is transform to string idiom.
                var text = ((+val) + (+num)) + '';
                if(text === '0') { text = ''; }
                Util.badge._text(text);
            });
        },
        leftTime : function(msec) {
            var params = Util.badge._generateTimeParamsFromMsec(msec);
            Util.badge._text(params.text);
            Util.badge._color(params.color);
        },
        /* private msecを与えられ、時間文字列と色文字列を返す */
        _generateTimeParamsFromMsec : /* dict */function(endtime) {
            var msec = endtime - (new Date()).getTime();
            var params = {
                text  : '10m',
                color : '#0FABB1'
            };
            var sec = Math.floor(msec / 1000);
            if(sec < 60) {
                params.text  = '0';
                params.color = '#F00';
                return params;
            }
            var min = Math.floor(sec / 60);
            if(min < 60){
                params.text = min + 'm';
                return params;
            }
            var hour = Math.floor(min / 60);
            params.text = hour + 'h' + '+';
            return params;
        },
        /* private */
        _text : /* void */function(text) {
            if(text == null) { text = ''; }
            chrome.browserAction.setBadgeText({text:text});
        },
        /* private */
        _color : /* void */function(color){
            chrome.browserAction.setBadgeBackgroundColor({color:color});
        }
    };

    Util.system = {
        log : function(value, useStyle) {
            var myStorage = new MyStorage();
            if(myStorage.get('isDebug')) {
                if(useStyle) {
                    console.log(value, 'font-size: 1.2em; font-weight: bold;','');
                } else {
                    console.log(value);
                }
            }
        },
        getChromeVersion : function(){
            return parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
        },
        debug : function(){
            localStorage.isDebug = true;
        }
    };

    Util.focusKCWidgetWindow = function(widgetWindow) {
        var callback = function(){/* do something */};

        if(typeof(widgetWindow) !== 'undefined'){
            chrome.windows.update(widgetWindow.id, {focused:true}, callback);
        }else{
            chrome.windows.getAll({populate:true},function(windows) {
                for(var i in windows) {
                    if(windows.hasOwnProperty(i)) {
                        var w = windows[i];
                        if(!w.tabs || w.tabs.length < 1) { continue; }
                        if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                            chrome.windows.update(w.id,{focused:true}, callback);
                            break;
                        }
                    }
                }
            });
        }
    };

    Util.ifCurrentIsKCWidgetWindow = function(isCallback, notCallback) {
        if(notCallback == null) { notCallback = function(){}; }

        chrome.windows.getCurrent({populate:true},function(w){
            if(!w.tabs || w.tabs.length < 1){
                notCallback();
                return;
            }else if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                isCallback();
                return;
            }else{
                notCallback();
                return;
            }
        });
    };

    Util.ifThereIsAlreadyKCWidgetWindow = function(isCallback, notCallback) {
        chrome.windows.getAll({populate:true}, function(windows) {
            for(var i in windows) {
                if(windows.hasOwnProperty(i)) {
                    var w = windows[i];
                    if(!w.tabs || w.tabs.length < 1) { continue; }
                    if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                        isCallback(w);
                        return;
                    }
                }
            }
            notCallback();
            return;
        });
    };

    Util.openCapturedPage = function(window_id, doneCallback) {
        if(doneCallback == null) { doneCallback = function(){/* do nothing */}; }

        chrome.tabs.captureVisibleTab(window_id, {'format':'png'}, function(dataUrl) {
            if(Config.get('capture-destination-size') === true){
                dataUrl = Util.resizeImage(dataUrl);
            }
            
            var imgTitle = Util.getFormattedDateString();

            var win = window.open();
            var img = document.createElement('img');
            img.src = dataUrl;
            img.alt = imgTitle;
            var date = new Date().toLocaleString();
            win.document.title = date;
            win.document.body.appendChild(img);

            // メソッド切り分けしない
            if(Config.get('download-on-screenshot')){
                var a = win.document.createElement('a');
                a.href = dataUrl;
                a.download = imgTitle;
                a.click();
            }

            /* >>>>>>>>>>> 座標決定検証用ブロック >>>>>>>>>>>> */
            if(localStorage.isDebug){
                var callback = function(res) {
                    console.log(res.result +'\t'+ Util.assureTimeString(res.result));
                };
                for(var i =1; i<5; i+=1){
                    win.document.body.appendChild(document.createElement('br'));
                    var trimmedURI = Util.trimCapture(dataUrl, 'nyukyo', i);
                    var trimmedImg = new Image();
                    trimmedImg.src = trimmedURI;
                    Util.sendServer(trimmedURI, callback);
                    win.document.body.appendChild(trimmedImg);
                }
            }
            /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

            doneCallback(dataUrl);
        });
    };

    /**
     * public
     * 入渠、建造の残り時間をキャプチャしてトリミングしてOCRサーバに送る。
     * 返ってきたOCR結果は callback に渡す
     */
    Util.extractFinishTimeFromCapture = function(window_id, purpose, dockId, callback){
        if(callback == null) { callback = function(){/* do nothing */}; }

        chrome.tabs.captureVisibleTab(window_id, {'format':'png'}, function(dataURI){

            // トリミングする
            var trimmedURI = Util.trimCapture(dataURI, purpose, dockId);

            // デバッグモードならトリミング後の画像を出す
            if(localStorage.isDebug === true){
                var trimmedImg = new Image();
                trimmedImg.src = trimmedURI;
                var win = window.open();
                win.document.title = new Date().toLocaleDateString();
                win.document.body.appendChild(trimmedImg);
            }

            // OCRサーバへ送る
            Util.sendServer(trimmedURI, function(res){
                res.result = Util.assureTimeString(res.result);
                res.dataURI = dataURI;
                callback(res);
            });
        });
    };

    /**
     * キャプチャした画像をリサイズする
     * @param dataURI {String} Image
     * @param mode {String} Widget mode
     * @return {String} dataURI of image
     */
    Util.resizeImage = function(dataURI/* , mode */) {
        //mode = 'm';
        var img = new Image();
        img.src = dataURI;

        var canvas = document.createElement('canvas');
        canvas.id = 'resize';
        // とりあえずハードでいいや
        canvas.width  = 800;
        canvas.height = 480;
        var context = canvas.getContext('2d');

        context.drawImage(
            img,
            0,0,
            img.width, img.height,
            0,0,
            canvas.width, canvas.height
        );

        return canvas.toDataURL();
    };

    Util.detectAndCapture = function() {
        Util.ifThereIsAlreadyKCWidgetWindow(function(w){
            Util.openCapturedPage(w.id);
        });
    };

    Util.trimCapture = function(dataUrl, purpose, dockId) {

        var img = new Image();
        img.src = dataUrl;

        var params = Util.defineTrimmingCoordsAndSize(img, purpose, dockId);

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

    Util.defineTrimmingCoordsAndSize = function(wholeImage, purpose, dockId){
        var map = Constants.trimmingParamsMapping;
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

    Util.sendServer = function(binaryString, callback){

        var encodeHTMLForm = function(data){
            var params = [];
            for(var name in data){
                if(data.hasOwnProperty(name)) {
                    var value = data[name];
                    var param = encodeURIComponent( name ).replace( /%20/g, '+' )
                            + '=' + encodeURIComponent( value ).replace( /%20/g, '+' );
                    params.push( param );
                }
            }
            return params.join( '&' );
        };

        var server = {};
        var upload = Constants.ocr.upload;
        var selectURL = function(){
            var servers = Constants.ocr.servers;
            var _i = Math.floor(Math.random() * servers.length);
            server = servers[_i];
            return upload.protocol + server.name + server.port + upload.path;
        };

        var xhr = new XMLHttpRequest();
        xhr.open(upload.method , selectURL());

        var data = encodeHTMLForm({ imgBin : binaryString });

        xhr.addEventListener('load', function() {
            if(xhr.status !== 200) {
                alert('server : ' + server.name + '\n' +
                      'status : ' + xhr.status + '\n' +
                      'text : ' + xhr.statusText + ',サーバエラーっぽい');
                return;
            }

            var response = JSON.parse(xhr.response);
            response.status = xhr.status;
            callback(response);
            return;
        });

        xhr.send(data);
    };

    Util.getFormattedDateString = function(format){
        if(typeof format === 'undefined') { format = null; }
        var d = new Date();
        var s = d.getFullYear() + Util.zP(2, d.getMonth() + 1) + Util.zP(2, d.getDate()) + Util.zP(2, d.getHours()) + Util.zP(2, d.getMinutes() + Util.zP(2, d.getSeconds()));
        return s;
    };

    Util.getNearestDailyAchievementResetTime = function(){
        var now = new Date();
        var diff_hours = (now.getHours() + 19) % 24;
        var _1hour_msec = 1*60*60*1000;
        var last_5am = new Date(now - diff_hours * _1hour_msec);
        return (new Date(1900 + last_5am.getYear(), last_5am.getMonth(), last_5am.getDate(), 5, 0)).getTime();
    };

    Util.getNearestWeeklyAchievementResetTime = function(){
        var now = new Date();
        var diff_days = (now.getDay() + 6) % 7;
        var _1day_msec = 1*24*60*60*1000;
        var last_monday = new Date(now - diff_days * _1day_msec);
        return (new Date(1900 + last_monday.getYear(), last_monday.getMonth(), last_monday.getDate(), 5, 0)).getTime();
    };

    Util.dict2hashString = function(dict){
        var arr = [];
        for(var i in dict) {
            if(dict.hasOwnProperty(i)) {
                arr.push(i + '=' + dict[i]);
            }
        }
        return arr.join('&');
    };

    /**
     * Windows版でのみサイズがおかしくなるのでこれを呼んでおくと onload イベントで修正される
     * @param win {Object} windowオブジェクト
     */
    Util.adjustSizeOfWindowsOS = function(win) {
        win.onload = (function(_win) {
            return function() {
                setTimeout(function() {
                    Util.adjustSizeOfWindowsOSImmediately(_win);
                }, 100);
            };
        })(win);
    };

    /**
     * adjustSizeOfWindowsOS の即時実行版
     * @param win {Object} windowオブジェクト
     */
    Util.adjustSizeOfWindowsOSImmediately = function(win) {
        if (navigator.userAgent.match(/Win/) || navigator.platform.indexOf('Win') !== -1) {
            var diffWidth = win.outerWidth - win.innerWidth;
            var diffHeight = win.outerHeight - win.innerHeight;
            win.resizeTo(win.outerWidth + diffWidth, win.outerHeight + diffHeight);
        }
    };

    Util.zP = function(order, text) {
        for(var i = 0; i < order; i += 1){
            text = '0' + text;
        }
        return text.slice(order*(-1));
    };

    Util.getWidgetTitle = function(){
        var index = Math.random();
        var _i = 0;
        if(index < Constants.widget.title.rate){
            _i = Math.floor(Math.random() * Constants.widget.title.default.length);
            return Constants.widget.title.default[_i];
        }else{
            // スペシャルは全部セリフなのでカギカッコつけます
            _i = Math.floor(Math.random() * Constants.widget.title.special.length);
            return '「' + Constants.widget.title.special[_i] + '」';
        }
    };

    Util.sortReminderParamsByEndtime = function(params) {
        return params.sort(function(f, l) {
            return (f.rawtime > l.rawtime);
        });
    };

    Util.assureTimeString = function(str) {
        if(typeof(str) !== 'string') { str = ''; }

        var map = Constants.assuranceStringMap;
        for(var vagueString in map){
            if(map.hasOwnProperty(vagueString)) {
                var regex = new RegExp(vagueString, 'g');
                str = str.replace(regex, map[vagueString]);
            }
        }
        if(str === '00200200') { str = '00:00:00'; }
        return str;
    };

    Util.timeStr2finishEpochMsec = function(str) {
        var match = str.match(/([0-9]{2}):([0-9]{2}):([0-9]{2})/);
        if(!match || match.length < 4) { return null; }
        var diffMinute = (match[1] | 0) * 60 + (match[2] | 0) + 2/*なんか微妙な誤差*/;
        var diffMsec = diffMinute * 60 * 1000;
        var finishTime = new Date((new Date()).getTime() + diffMsec);
        return finishTime.getTime();
    };

    /**
     * 時間の手動入力
     */
    Util.enterTimeManually = function(params,url) {
        var path = chrome.extension.getURL('/') + url;
        var qstr = '?' + Util.dict2hashString(params);
        // TODO: left,topは動的に欲しい。screenLeftが謎に0
        var win = window.open(path + qstr, '_blank', 'width=400,height=250,left=600,top=200');
        Util.adjustSizeOfWindowsOS(win);
    };

    Util.openLoaderWindow = function() {
        var pageURL = chrome.extension.getURL('/') + 'src/html/loader.html';
        var pos = Tracking.get('widget').position;
        var loadingWindow = window.open(pageURL, '_blank', 'width=180,height=200,top=' + pos.top + ',left=' + pos.left);
        return loadingWindow;
    };

    Util.getLoaderBackgroundImage = function() {
        var imgList = Constants.ocr.loader.images.normal;
        var _i = Math.floor(Math.random() * imgList.length);
        return imgList[_i];
    };
})();
