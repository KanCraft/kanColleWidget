/**
 * dependency: MyStorage
 */

//----- 設定を見たうえでalertする -----
/* void */function _presentation(text, force, createdCallBack){
    if(typeof createdCallBack == 'undefined') createdCallBack = function(){/* do nothing */};
    if(force || Config.get('enable-notification')) {
        if(_getChromeVersion() >= 28) {
            var iconUrl = Config.get('notification-img-url') || Constants.notification.img;
            var params = {
                type: "basic",
                title: "艦これウィジェット",
                message: text,
                iconUrl: iconUrl
            }
            chrome.notifications.create(String((new Date()).getTime()), params, function(){ createdCallBack(); });
            chrome.notifications.onClicked.addListener(function(){
                focusKCWidgetWindow();
            });
        } else {
            alert(text);
        }
    }
}
//----- バッジの色とかテキストを変える -----
/* void */function _updateBadge(params){
    chrome.browserAction.setBadgeText(params);
}
//----- バッジテキストを変える -----
/* void */function updateBadgeText(text){
    chrome.browserAction.setBadgeText({text:text});
}
//----- バッジ色を変える -----
/* void */function updateBadgeColor(color){
    chrome.browserAction.setBadgeBackgroundColor({color:color});
}
/* void */function clearBadge(){
    updateBadgeText('');
}

/* void */function incrementBadge(num){
    if(typeof num == 'undefined') num = 1;
    chrome.browserAction.getBadgeText({},function(val){
        if(val == '') val = 0;
        var text = String(parseInt(val) + parseInt(num));
        if(text == '0') text = '';
        _updateBadge({text:text});
    });
}
/* void */function _log(value, useStyle){
    var myStorage = new MyStorage();
    if(myStorage.get('isDebug')){
        if(useStyle) console.log(value, 'font-size: 1.2em; font-weight: bold;','');
        else console.log(value);
    }
}
/* int */function _getChromeVersion() {
    return parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
}

/* void */function focusKCWidgetWindow(cb){
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
}

/* f() */function ifCurrentIsKCWidgetWindow(isCallback,notCallback){
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
}
/* f() */function ifThereIsAlreadyKCWidgetWindow(isCallback, notCallback){
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
}

/* void */function badgeLeftTime(/* epoch */msec){
    var params = _getBadgeParamsFromLeftTime(msec);
    updateBadgeText(params.text);
    updateBadgeColor(params.color);
}
/* dict */function _getBadgeParamsFromLeftTime(/* epoch */endtime){
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
}

// 直近のデイリーリセットがサーバサイドで発火したであろうepochタイムを返す
/* epoch: int */function getNearestDailyAchievementResetTime(){
    var now = new Date();
    var diff_hours = (now.getHours() + 19) % 24;
    var _1hour_msec = 1*60*60*1000;
    var last_5am = new Date(now - diff_hours * _1hour_msec);
    return (new Date(1900 + last_5am.getYear(), last_5am.getMonth(), last_5am.getDate(), 5, 0)).getTime();
}

// 直近のウィークリーリセットがサーバサイドで発火したであろうepochタイムを返す
/* epoch: int */function getNearestWeeklyAchievementResetTime(){
    var now = new Date();
    var diff_days = (now.getDay() + 6) % 7;
    var _1day_msec = 1*24*60*60*1000;
    var last_monday = new Date(now - diff_days * _1day_msec);
    return (new Date(1900 + last_monday.getYear(), last_monday.getMonth(), last_monday.getDate(), 5, 0)).getTime();
}

/* string */function dict2hashString(dict){
    var arr = [];
    for(var i in dict){
        arr.push(i + '=' + dict[i]);
    }
    return arr.join('&');
}
