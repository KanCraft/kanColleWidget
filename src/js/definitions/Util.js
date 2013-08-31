/**
 * dependency: MyStorage
 */

//----- 設定を見たうえでalertする -----
/* void */function _presentation(text){
    if(localStorage.getItem('config_showAlert') == 'false') return;
    if(_getChromeVersion() >= 28) {
        webkitNotifications.createNotification("icon.png", "艦これウィジェット", text).show();
    } else {
        alert(text);
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

//----- ウィジェットウィンドウかどうかを調べる -----
/* f(Boolean) */function _isKCWWindow(cb){
    chrome.windows.getCurrent({populate:true},function(d){
        if(typeof d == 'undefined') cb(false);//windows.getCurrent: No current window
        else cb((d.tabs[0].url.match(/http[s]?:\/\/[0-9\.]+\/kcs/) != null));
    });
}
//----- HTTPRequestを解析してフォーマット整ったキーワードとパラメータにする -----
/* dict */function _parseRequestData(data){
    var res = {
        keyword: null,
        params : null
    };
    if(data.url.match(/\/kcsapi\//)){
        res.keyword = data.url.match(/\/kcsapi\/(.*)/)[1];
        if(data.method == 'POST'){
            res.params = data.requestBody.formData;
        }
    }
    return new Dispatcher(res);
}
function Dispatcher(parsed){/** パースの結果をラップします **/
    this.keyword = parsed.keyword;
    this.params  = parsed.params;
}

/* int */function _getChromeVersion() {
    return parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
}
