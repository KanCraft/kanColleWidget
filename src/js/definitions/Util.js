/**
 * dependency: MyStorage
 */

//----- 設定を見たうえでalertする -----
/* void */function _presentation(text, force){
    var myStorage = new MyStorage();
    if(force || myStorage.get('config_showAlert')) {
        if(_getChromeVersion() >= 28) {
            var params = {
                type: "basic",
                title: "艦これウィジェット",
                message: text,
                iconUrl: "./icon.png"
            }
            chrome.notifications.create(String((new Date()).getTime()), params, function(){/* do nothing */});
            chrome.notifications.onClicked.addListener(focusKCWidgetWindow);
        } else {
            alert(text);
        }
    }
}
//----- バッジの色とかテキストを変える -----
/* void */function _updateBadge(params){
    chrome.browserAction.setBadgeText(params);
}
/* void */function _clearBadge(){
    _updateBadge({text:''});
}
/* void */function _incrementBadge(){
    chrome.browserAction.getBadgeText({},function(val){
        if(val == '') val = 0;
        var text = String(parseInt(val) + 1);
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
    if(!cb) cb = function(){};
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
