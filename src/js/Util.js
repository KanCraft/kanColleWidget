/**
 * dependency: MyStorage
 */

var Util = {
    /* public 設定を見たうえでnotificationする */
    presentation : /* void */function(text, force, opt){
        if(typeof opt != 'object') opt = {};
        if(typeof opt.callback != 'function') opt.callback = function(){/* do nothing */};
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
                if(url){
                    var audio = new Audio(url);
                    audio.play();
                }
                chrome.notifications.create(String((new Date()).getTime()), params, function(){ opt.callback(); });
                chrome.notifications.onClicked.addListener(function(){
                    Util.focusKCWidgetWindow();
                });
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
    focusKCWidgetWindow : function(){
        if(typeof cb == 'undefined') cb = function(){};
        chrome.windows.getAll({populate:true},function(windows){
            for(var i in windows){
                var w = windows[i];
                if(!w.tabs || w.tabs.length < 1) return;
                if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                    chrome.windows.update(w.id,{focused:true}, function(){
                        cb();
                    });
                }
            }
        });
    },
    ifCurrentIsKCWidgetWindow : function(isCallback,notCallback){
        if(!notCallback) notCallback = function(){};
        chrome.windows.getCurrent({populate:true},function(w){
            if(!w.tabs || w.tabs.length < 1){
                notCallback();
            }else if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                isCallback();
            }else{
                notCallback();
            }
        });
    },
    ifThereIsAlreadyKCWidgetWindow : function(isCallback, notCallback){
        chrome.windows.getAll({populate:true},function(windows){
            for(var i in windows){
                var w = windows[i];
                if(!w.tabs || w.tabs.length < 1) continue;
                if(w.tabs[0].url.match(/^http:\/\/osapi.dmm.com\/gadgets\/ifr/)){
                    return isCallback();
                }
            }
            return notCallback();
        });
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
    }
}
