/* jshint browser:true */
/* global KanColleWidget, chrome, Constants, Tracking, Config, MyStorage, CanvasTool */
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

            if (Config.get('use-white-mode-as-default')) return Util.openSafeMode();

            var options = 'width={w},height={h},location=no,toolbar=no,menubar=no,status=no,scrollbars=no,resizable=no,left={l},top={t}';
            options = options.replace('{w}', width + '')
                             .replace('{h}', (width * Constants.widget.aspect) + '')
                             .replace('{l}', pos.left + '')
                             .replace('{t}', pos.top + '');
            var kanColleUrl = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/?mode='+mode;
            window.open(kanColleUrl, '_blank', options);
            callback();
        });
    };

    /**
     * public notificationを作ってイベントバインドしたうえでshowする
     * ここに来るときは既にnotificationすべきかどうかの判定が済んでいるものとする
     */
    Util.presentation = function(text, opt) {
        if(Util.notifier == null) {
            var assetManager = new KanColleWidget.AssetManager(chrome, Config, Constants);
            Util.notifier    = new KanColleWidget.Notifier(window, assetManager, Config, Constants, Tracking, Util);
        }
        Util.notifier.giveNotice(text, opt);
    };

    /**
     * とりあえずwindow.confirmをラップしとく
     * @param message
     * @param ok
     * @param ng
     */
    Util.confirm = function(message, ok, ng) {
        if (typeof ok == 'undefined') throw "missing ok callback";
        var ng = ng || function(){};
        if(window.confirm(message)) {
            ok();
        } else {
            ng();
        }
    };

    Util.isNumeric = function(str) {
        return /^\d+$/.test(str);
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
                if(! Util.isNumeric(val)) val = 0;
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
        isWindows: function(){
            if (navigator.userAgent.match(/Win/) || navigator.platform.indexOf('Win') !== -1) return true;
            return false;
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
            Util.findWidgetWindow(function(w){
                if (! w) return;
                chrome.windows.update(w.id, {focused:true}, callback);
            });
        }
    };

    Util.findWidgetWindow = function(callback, opt) {
        var opt = opt || {};
        opt.containDMM = opt.containDMM || false;

        chrome.windows.getAll({populate:true},function(windows) {
            for(var i in windows) {
                if(windows.hasOwnProperty(i)) {
                    var w = windows[i];
                    if(!w.tabs || w.tabs.length < 1) { continue; }

                    var url = w.tabs[0].url;
                    var found = Util._isWidgetURL(url);

                    if (opt.containDMM && Util._isDMMURL(url)) found = true;

                    if (found) return callback(w);
                }
            }
            return callback();
        });
    };

    Util._isWidgetURL = function(url) {
        if(url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
            return true;
        }
        return false;
    };
    Util._isDMMURL = function(url) {
        if(url.match(/^http:\/\/www.dmm.com\/.+\/app_id=854854/)) {
            return true;
        }
        return false;
    };

    Util.closeWidgetWindow = function(callback) {
        var callback = callback || function(){};
        Util.findWidgetWindow(function(w){
            if (! w) return;
            chrome.windows.remove(w.id, callback);
        });
    };
    Util.openOriginalWindow = function(callback){
        var callback = callback || function(){};
        var win = window.open("http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/");
        callback(win);
    };

    Util.ifCurrentIsKCWidgetWindow = function(isCallback, notCallback) {
        if(notCallback == null) { notCallback = function(){}; }

        chrome.windows.getCurrent({populate:true},function(w){
            if(!w.tabs || w.tabs.length < 1){
                notCallback();
                return;
            }else if(Util._isWidgetURL(w.tabs[0].url)){
                isCallback();
                return;
            }else{
                notCallback();
                return;
            }
        });
    };

    Util.ifThereIsAlreadyKCWidgetWindow = function(isCallback, notCallback) {

        var isCallback = isCallback || function(){};
        var notCallback = notCallback || function(){};

        chrome.windows.getAll({populate:true}, function(windows) {
            for(var i in windows) {

                if(! windows.hasOwnProperty(i)) continue;

                var w = windows[i];
                if(!w.tabs || w.tabs.length < 1) continue;

                var url = w.tabs[0].url;
                if(Util._isWidgetURL(url) || Util._isDMMURL(url)) {
                    return isCallback(w);
                }
            }
            return notCallback();
        });
    };

    Util.openCapturedPage = function(windowId, doneCallback) {
        if(doneCallback == null) { doneCallback = function(){/* do nothing */}; }

        var opt = {
            format  : Config.get('capture-image-format') || 'png'
        };

        chrome.tabs.captureVisibleTab(windowId, opt, function(dataUrl) {
            if(Config.get('capture-destination-size') === true){
                dataUrl = Util.removeBlackBlank(dataUrl);
                dataUrl = Util.resizeImage(dataUrl);
            }

            var imgTitle = Util.getCaptureFilenameFull();

            // メソッド切り分けしない
            if(Config.get('download-on-screenshot')){
                Util.downloadImage(dataUrl);
                return;
            }

            Util.openCaptureByImageURI(dataUrl);

            doneCallback(dataUrl);
        });
    };

    Util.openCaptureByImageURI = function(imgURI){
        var pageURL = chrome.extension.getURL('/') + 'src/html/capture.html';
        pageURL += '?uri=' + imgURI;
        var win = window.open(pageURL);
    };

    Util.downloadImage = function(url, data) {
        var data = data || {
            dir: Config.get('capture-image-download-dir'),
            file: Util.getCaptureFilename(),
            url: url
        };
        var fileFullPath = data.dir;
        if (fileFullPath.trim() != '') fileFullPath += '/';
        fileFullPath += data.file;
        fileFullPath += '.' + Config.get('capture-image-format').replace('e','');
        chrome.downloads.download({
            url: data.url,
            filename: fileFullPath
        },function(a,b,c){
            //console.log('in callback', a, b, c);
        });
    };

    Util.getCaptureFilenameFull = function(){
        return Util.getCaptureFilename() + '.' + Config.get('capture-image-format');
    };
    Util.getCaptureFilename = function(){
        var prefix = Config.get('capture-image-filename-prefix');
        var time = Util.getTimeText('capture');
        return prefix + '_' + time;
    };

    Util.getTimeText = function(purpose){
        var d = new Date();
        var formatCapture = function(_d){
            var date = [];
            var time = [];
            date.push(_d.getYear() + 1900);
            date.push(Util.zP(2, _d.getMonth() + 1));
            date.push(Util.zP(2, _d.getDate()));
            time.push(Util.zP(2, _d.getHours()));
            time.push(Util.zP(2, _d.getMinutes()));
            time.push(Util.zP(2, _d.getSeconds()));
            return date.join('') + '_' + time.join('');
        };
        switch(purpose){
            case 'capture':
                return formatCapture(d);
            default:
                return d.toLocaleDateString();
        }
    };

    /**
     * 画面全体のURIを渡すと、余黒を取り除いたURIを返す
     * @param dataURI
     * @returns {string|*}
     */
    Util.removeBlackBlank = function(dataURI) {
        var img = new Image();
        img.src = dataURI;
        // 余黒を取り除く
        var blank = Util.getBlank(img.width, img.height);

        var trimmedURI = Util.trimImage(
            dataURI,
            {
                left: blank.offsetLeft,
                top : blank.offsetTop
            },
            {
                width: img.width - blank.width,
                height: (img.width - blank.width) * 0.6
            }
        );
        return trimmedURI;
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

        var format = Config.get('capture-image-format') || 'png';
        format = "image/" + format;

        return canvas.toDataURL(format);
    };

    Util.detectAndCapture = function() {
        Util.ifThereIsAlreadyKCWidgetWindow(function(w){
            Util.openCapturedPage(w.id);
        });
    };

    // TODO: 一本化 getTimeText
    Util.getFormattedDateString = function(format){
        if(typeof format === 'undefined') { format = null; }
        var d = new Date();
        var s = d.getFullYear() +
                Util.zP(2, d.getMonth() + 1) +
                Util.zP(2, d.getDate()) +
                Util.zP(2, d.getHours()) +
                Util.zP(2, d.getMinutes()) +
                Util.zP(2, d.getSeconds());
        return s;
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
        if (Util.system.isWindows()) {
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

    Util.sortEvents = function(params) {
        if (! Config.get('sort-by-finishtime')) {
            return params.sort(function(f, l) {
                for (var k in f) {
                    var key = '';
                    if(k.match('_id')){
                        key = k;
                    }
                }
                return (f[key] > l[key]);
            });
        }
        return params.sort(function(f, l) {
            return (f.finish > l.finish);
        });
    };

    Util.timeStr2finishEpochMsec = function(str) {
        var match = str.match(/([0-9]{2}):([0-9]{2}):([0-9]{2})/);
        if(!match || match.length < 4) { return null; }
        var diffMinute = (match[1] | 0) * 60 + (match[2] | 0);
        var diffMsec = diffMinute * 60 * 1000 + (match[3] | 0) * 1000;
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

    Util.getLoaderBackgroundImage = function(id) {
        var imgList = Constants.ocr.loader.images.normal;
        if (Util.isNumeric(id)) {
          return imgList[id];
        }
        return Util.arrayRand(imgList);
    };

    Util.isSpecialTerm = function() {
        // 4月1日対応
        var d = new Date();
        if (d.getMonth() == 3 && d.getDate() == 1) return true;
        return false;
    };

    /**
     * 艦これ的な"今日"の日付を返します
     * 5:00~24:00なら今日の日付、0:00~4:59の間なら昨日の日付を返す
     */
    Util.getTodayOfKanColle = function() {
        var theDay = new Date();
        if (theDay.getHours() < 5) {
            // 艦これ的には"今日"は昨日のことです
            theDay.setDate(theDay.getDate() - 1);
        }
        return theDay;
    };

    /**
     * 直近朝5時のタイムスタンプを返す
     * @returns {number}
     */
    Util.getDailyResetTimestamp = function() {

        var theDay, today;
        theDay = today = new Date();

        if (today.getHours() < 5) {
            // 直近の5時とは昨日のことです
            theDay.setDate(today.getDate() - 1);
        }

        // その日の朝5時を取得します
        var year   = theDay.getUTCFullYear();
        var month  = theDay.getMonth();
        var date   = theDay.getDate();
        var hour   = 5;// 5時です
        var minute = 0;// 5時ちょうどです

        var theTime = new Date(year, month, date, hour, minute);

        return theTime.getTime();
    };

    /**
     * 直近月曜日朝5時のタイムスタンプを返す
     * @returns {number}
     */
    Util.getWeeklyResetTimestamp = function() {
        var theDay, now;
        theDay = now = new Date();

        if (now.getDay() < 1) {
            // 今日は日曜日なので
            // 直近の月曜日とは今から6日前のことです
            theDay.setDate(now.getDate() - 6);
        } else if (now.getDay() == 1) {
            // 今日は月曜日ですが
            if (now.getHours() < 5) {
                // まだ5時より前なのだから
                // 直近の月曜日とは7日前のことです
                theDay.setDate(now.getDate() - 7);
            } else {
                // 5時すぎてるので、
                // 直近の月曜日とは今日のことです
            }
        } else { // if (1 < now.getDay())
            // 今日は火曜日、水曜日、木曜日、金曜日、土曜日なので
            // 直近の月曜日とは、 {now.getDay() - 1}日前のことです
            var diffDays = now.getDay() - 1;
            theDay.setDate(now.getDate() - diffDays);
        }

        // その日の朝5時を取得します
        var year   = theDay.getFullYear();
        var month  = theDay.getMonth();
        var date   = theDay.getDate();
        var hour   = 5;// 5時です
        var minute = 0;// 5時ちょうどです

        var theTime = new Date(year, month, date, hour, minute);

        return theTime.getTime();
    };

    /**
     * まあin_arrayですよ。単純なObjectでも対応
     * @param val
     * @param arr
     * @returns {boolean}
     */
    Util.inArray = function(val, arr) {
        for (var i in arr) {
            if (val == arr[i]) return true;
        }
        return false;
    };
    Util.arrayRand = function(arr) {
        var _i = Math.floor(Math.random() * arr.length);
        return arr[_i];
    };

    /**
     * location.urlの?以下をパース
     * @returns {{}}
     */
    Util.parseQueryString = function(){
        var res = {};
        var qstr = location.search;
        qstr.replace(/^\?/,'').split('&').map(function(k_v){
            var _tmp = k_v.split('=');
            res[_tmp[0]] = _tmp[1];
        });
        return res;
    };

    Util.getWidgetWindowCapture = function(cb, options) {
        var options = options || {format: 'png'};
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            chrome.tabs.captureVisibleTab(
                widgetWindow.id,
                options,
                function(dataURI){
                    cb(dataURI);
                }
            );
        });
    };

    // TODO: DRY
    // @see src/js/process/DetectTime.js
    /**
     * @param dataURI
     * @param coords
     * @param size
     * @param opt
     * @returns {string}
     */
    Util.trimImage = function(dataURI, coords, size, opt){
        var opt = opt || {format:'jpeg'};
        var img = new Image();
        img.src = dataURI;

        var canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width  = size.width;
        canvas.height = size.height;
        var ctx = canvas.getContext('2d');

        ctx.drawImage(
            img,
            coords.left,
            coords.top,
            size.width,
            size.height,
            0, // offset left in destination Image
            0, // offset top in destination Image
            canvas.width,
            canvas.height
        );

        return canvas.toDataURL('image/' + opt.format);
        /*
        var png24 = new CanvasTool.PngEncoder(canvas, {
            colourType: CanvasTool.PngEncoder.ColourType.TRUECOLOR
        }).convert();
        */
        return 'data:image/'+ opt.format +';base64,' + btoa(canvas);
    };

    /**
     * 現在のスクリーンサイズを渡すと、余黒の大きさと、
     * ターゲットまでのオフセットを返す
     * @param width
     * @param height
     * @returns {{offsetTop: number, offsetLeft: number, height: number, width: number}}
     */
    Util.getBlank = function(width, height) {
        var screen = {width:width, height:height};
        var aspect = 0.6;
        var blank = {
            offsetTop:0, offsetLeft:0,
            height:0, width:0};
        if (screen.height / screen.width < aspect) {
            blank.width = screen.width - (screen.height / aspect);
            blank.offsetLeft = blank.width / 2;
        } else {
            blank.height = screen.height - (screen.width * aspect);
            blank.offsetTop = blank.height / 2;
        }
        return blank;
    };
    Util.extend = function(_sub, _super) {
        _sub.prototype = Object.create(_super.prototype);
        _sub.prototype.constructor = _super;
        return _sub;
    };

    Util.openDashboard = function(){
        // TODO: PageManagerみたいなの作って、chrome.windows使う
        var dashboard = Tracking.get('dashboard');
        var width = dashboard.size.innerWidth || 420; 
        var height = dashboard.size.innerHeight || 245;
        var options = [
            'width=' + width,
            'height='+ height,
            'left='  + dashboard.position.left,
            'top='   + dashboard.position.top
        ];
        var fixedOptions = ',location=no,toolbar=no,menubar=no,status=no,scrollbars=no,resizable=no';
        var optionStr = options.join(',') + fixedOptions;
        var dashboardWindow = window.open(chrome.extension.getURL('/') + 'src/html/dashboard.html', "_blank", optionStr);
        Util.adjustSizeOfWindowsOS(dashboardWindow);
    };

    Util.openSafeMode = function(){
        var pos = Tracking.get('widget').position;
        var type = 'normal';
        var height = 480 + 72;
        if (Config.get('hide-adressbar-in-safemode')) {
            type = 'popup';
            height = height - 72;
        }
        chrome.windows.create({
            url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/" + "?widget=true",
            width:  800,
            height: height,
            left: pos.left,
            top: pos.top,
            type: type
        },function(win){
        });
    };

    Util.haveNewUpdate = function(){
        // エイプリルフール対応
        if (Util.isSpecialTerm()) return true;
        return Constants.release.announceVersion > Config.get("announce-already-read");
    };
    Util.getTweetServerURL = function(){
        if (localStorage.getItem('isDebug') == 'true') {
            return 'http://localhost:16000';
        }
        return Constants.tweetServer.url;
    };

    Util.resizeWindowAtWhite = function(tab) {

        var targetSize = {
            width: 800,
            height: 480
        };

        var diffWidth = targetSize.width - tab.width;
        var diffHeight = targetSize.height - tab.height;

        chrome.windows.get(tab.windowId, function (win) {

            var updateInfo = {
                width: win.width + diffWidth,
                height: win.height + diffHeight
            };

            chrome.windows.update(win.id,updateInfo,function(_win) {
                // Callback code
            });
        });
    };
})();
