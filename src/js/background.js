/**
 * background.js
 * ここはなるべくイベントのバインドしか書かない
 */

var observer = new Observer();

/***** JSがロードされたとき *****/
(function(){
    observer.start();
})();

/***** Main Listener 01 : ウィジェットウィンドウがフォーカスされた時 *****/
chrome.windows.onFocusChanged.addListener(function(id){
    _isKCWWindow(function(isKCW){
        if(isKCW){
            _clearBadge();
        }
    });
 });

/***** Main Listener 02 : ブラウザからHTTPRequestが送信される時 *****/
chrome.webRequest.onBeforeRequest.addListener(function(data){
    var dispatcher = _parseRequestData(data);
    var action     = new Action();
    // dispatcher.bind(actions).execute(); みたいなインターフェースがいい
    // となると、Dispatcher.jsが必要になるか
    switch(dispatcher.keyword){
        case 'api_req_mission/start':
            action.forMissionStart(dispatcher.params);
            break;
        case 'api_req_mission/result':
            action.forMissionResult(dispatcher.params);
            break;
        case 'api_get_master/payitem':
            action.forMasterPayitem(dispatcher.params);
        default:
            _log('%c[ACTION]%c Do Nothing for this request',true);
            _log(dispatcher);
    }
},{'urls':[]},['requestBody']);
