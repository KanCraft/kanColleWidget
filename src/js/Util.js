/**
 * dependency: MyStorage
 */

var Util = {
    focusOrLaunchIfNotExists : function(mode, callback){

        if(typeof callback == 'undefined') callback = function(){/* do nothing */}

        var width = '800';
        for(key in Constants.widget.width){
            if(Constants.widget.width[key].mode == mode){
                width = key;
                break;
            }
        }
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            Util.focusKCWidgetWindow(widgetWindow);
            callback();
            return;
        },function(){
            var options = "width={w},height={h},location=no,toolbar=no,menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40".replace('{w}', String(width)).replace('{h}', String(width * Constants.widget.aspect));
            var kanColleUrl = 'https://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/?mode='+mode;
            window.open(kanColleUrl,"_blank", options);
            callback();
        });
    },
    /* public 設定を見たうえでnotificationする */
    presentation : /* void */function(text, force, opt){
        if(typeof opt != 'object') opt = {};
        if(typeof opt.callback != 'function') opt.callback = function(){/* do nothing */};
        if(typeof opt.sound != 'boolean') opt.sound = true;
        if(force || Config.get('enable-notification')) {
            if(Util.system.getChromeVersion() >= 28) {
                var default_url = chrome.extension.getURL('/') + Constants.notification.img;
                var iconUrl = Config.get('notification-img-file') || default_url;
                if(opt && opt.iconUrl) iconUrl = opt.iconUrl;
                var params = {
                    type: "basic",
                    title: "艦これウィジェット",
                    message: text,
                    iconUrl: iconUrl
                };
                // 指定があれば音声を再生
                var url = Config.get('notification-sound-file');
                if(url && opt.sound){
                    var audio = new Audio(url);
                    audio.play();
                }
                chrome.notifications.create(String((new Date()).getTime()), params, function(){ opt.callback(); });
            } else {
                alert(text);
            }
        }else{
            opt.callback();
        }
    },
    badge : {
        clear : function(){
            Util.badge._text('');
        },
        increment : function(num){
            if(typeof num == 'undefined') num = 1;
            chrome.browserAction.getBadgeText({},function(val){
                if(val == '') val = 0;
                var text = String(parseInt(val) + parseInt(num));
                if(text == '0') text = '';
                Util.badge._text(text);
            });
        },
        leftTime : function(msec){
            var params = Util.badge._generateTimeParamsFromMsec(msec);
            Util.badge._text(params.text);
            Util.badge._color(params.color);
        },
        /* private msecを与えられ、時間文字列と色文字列を返す */
        _generateTimeParamsFromMsec : /* dict */function(endtime){
            var msec = endtime - (new Date()).getTime();
            var params = {
                text  : '10m',
                color : '#0FABB1',
            };
            var sec = Math.floor(msec / 1000);
            if(sec < 60){
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
        _text : /* void */function(text){
            if(text == undefined) text = '';
            chrome.browserAction.setBadgeText({text:text});
        },
        /* private */
        _color : /* void */function(color){
            chrome.browserAction.setBadgeBackgroundColor({color:color});
        }
    },
    system : {
        log : function(value, useStyle){
            var myStorage = new MyStorage();
            if(myStorage.get('isDebug')){
                if(useStyle) console.log(value, 'font-size: 1.2em; font-weight: bold;','');
                else console.log(value);
            }
        },
        getChromeVersion : function(){
            return parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
        }
    },
    focusKCWidgetWindow : function(widgetWindow){

        if(typeof widgetWindow != 'undefined'){
            chrome.windows.update(widgetWindow.id, {focused:true}, function(){
               /* do something */
            });
        }else{
            chrome.windows.getAll({populate:true},function(windows){
                for(var i in windows){
                    var w = windows[i];
                    if(!w.tabs || w.tabs.length < 1) continue;
                    if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                        chrome.windows.update(w.id,{focused:true}, function(){
                            /* do something */
                            return;
                        });
                        break;
                    }
                }
            });
        }
    },
    ifCurrentIsKCWidgetWindow : function(isCallback,notCallback){
        if(!notCallback) notCallback = function(){};
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
    },
    ifThereIsAlreadyKCWidgetWindow : function(isCallback, notCallback){
        chrome.windows.getAll({populate:true},function(windows){
            for(var i in windows){
                var w = windows[i];
                if(!w.tabs || w.tabs.length < 1) continue;
                if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                    isCallback(w);
                    return;
                }
            }
            notCallback();
            return;
        });
    },
    openCapturedPage : function(window_id, doneCallback){
        if(doneCallback == undefined) doneCallback = function(){/* do nothing */};
        chrome.tabs.captureVisibleTab(window_id, {'format':'png'}, function(dataUrl){
            var win = window.open();
            var img = document.createElement('img');
            img.src = dataUrl;
            var date = new Date().toLocaleString();
            win.document.title = date;
            win.document.body.appendChild(img);
            doneCallback();

            if(Config.get('download-on-screenshot')) Util.downloadImage(dataUrl);

            return;
        });
    },

    downloadImage : function(dataString, fileName, ext){
        if(typeof ext == 'undefined') ext = '.png';
        if(typeof fileName == 'undefined') fileName = Util.getFormattedDateString();
        var a = document.createElement('a');
        a.href = dataString;
        a.download = fileName + ext;
        a.click();
    },

    getFormattedDateString : function(format){
        if(typeof format == 'undefined') format = null;
        var d = new Date();
        var s = d.getFullYear() + Util.zP(2, d.getMonth() + 1) + Util.zP(2, d.getDate()) + Util.zP(2, d.getHours()) + Util.zP(2, d.getMinutes() + Util.zP(2, d.getSeconds()));
        return s;
    },

    getNearestDailyAchievementResetTime : function(){
        var now = new Date();
        var diff_hours = (now.getHours() + 19) % 24;
        var _1hour_msec = 1*60*60*1000;
        var last_5am = new Date(now - diff_hours * _1hour_msec);
        return (new Date(1900 + last_5am.getYear(), last_5am.getMonth(), last_5am.getDate(), 5, 0)).getTime();
    },
    getNearestWeeklyAchievementResetTime : function(){
        var now = new Date();
        var diff_days = (now.getDay() + 6) % 7;
        var _1day_msec = 1*24*60*60*1000;
        var last_monday = new Date(now - diff_days * _1day_msec);
        return (new Date(1900 + last_monday.getYear(), last_monday.getMonth(), last_monday.getDate(), 5, 0)).getTime();
    },
    dict2hashString : function(dict){
        var arr = [];
        for(var i in dict){
            arr.push(i + '=' + dict[i]);
        }
        return arr.join('&');
    },

    adjustSizeOfWindowsOS : function(win){
        // Windows版でのみサイズがおかしくなるそうなのでページがロードされたら修正
        if (navigator.userAgent.match(/Win/) || navigator.platform.indexOf("Win") != -1)
        {
            win.onload = (function(_win){
                return function(){
                    var diffWidth = _win.outerWidth - _win.innerWidth;
                    var diffHeight = _win.outerHeight - _win.innerHeight;
                    _win.resizeTo(_win.outerWidth + diffWidth, _win.outerHeight + diffHeight);
                };
            })(win);
        }
    },

    zP : function(order, text){
        for(var i=0;i<order;i++){
            text = '0' + text;
        }
        return text.slice(order*(-1));
    },

    getWidgetTitle : function(){
        var index = Math.random();
        if(index < Constants.widget.title.rate){
            var _i = Math.floor(Math.random() * Constants.widget.title.default.length);
            return Constants.widget.title.default[_i];
        }else{
            // スペシャルは全部セリフなのでカギカッコつけます
            var _i = Math.floor(Math.random() * Constants.widget.title.special.length);
            return "「" + Constants.widget.title.special[_i] + "」";
        }
    },

    sortReminderParamsByEndtime : function(params){
        return params.sort(function(f,l){ return (f.rawtime > l.rawtime);});
    }
}
