/* jshint browser:true */
/* global kanColleWidget, chrome, Constants, Tracking, Config, MyStorage, CanvasTool */
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
            var assetManager = new kanColleWidget.AssetManager(chrome, Config, Constants);
            Util.notifier    = new kanColleWidget.Notifier(window, assetManager, Config, Constants, Tracking, Util);
        }
        Util.notifier.giveNotice(text, opt);
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
                    if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/) ||
                       w.tabs[0].url.match(/^http:\/\/www.dmm.com\/.+\/app_id=854854/)) {
                        isCallback(w);
                        return;
                    }
                }
            }
            notCallback();
            return;
        });
    };

    Util.openCapturedPage = function(windowId, doneCallback) {
        if(doneCallback == null) { doneCallback = function(){/* do nothing */}; }

        chrome.tabs.captureVisibleTab(windowId, {'format':'png'}, function(dataUrl) {
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

            doneCallback(dataUrl);
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
            return (f.rawtime > l.rawtime);
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

    Util.getLoaderBackgroundImage = function() {
        var imgList = Constants.ocr.loader.images.normal;
        var _i = Math.floor(Math.random() * imgList.length);
        return imgList[_i];
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

})();
