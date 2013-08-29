/**
 * dependency: MyStorage
 */

//----- 設定を見たうえでalertする -----
/* void */function _presentation(text){
    if(localStorage.getItem('config_showAlert') == 'true')
        webkitNotifications.createNotification("icon.png", "艦これウィジェット", text).show();
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
/* void */function _log(value){
    var myStorage = new MyStorage();
    if(myStorage.get('isDebug')) console.log(value);
}

//----- ウィジェットウィンドウかどうかを調べる -----
/* f(Boolean) */function _isKCWWindow(cb){
    chrome.windows.getCurrent({populate:true},function(d){
        cb((d.tabs[0].url.match(/http[s]?:\/\/[0-9\.]+\/kcs/) != null));
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
    return res;
}