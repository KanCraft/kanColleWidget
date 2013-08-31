/**
 * dependency: MyStorage
 */

//----- 設定を見たうえでalertする -----
/* void */function _presentation(text, force){
    var myStorage = new MyStorage();
    if(force || myStorage.get('config_showAlert')) {
        if(_getChromeVersion() >= 28) {
            webkitNotifications.createNotification("icon.png", "艦これウィジェット", text).show();
        } else {
            alert(title);
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