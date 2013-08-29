/**
 * background.js
 * ここはなるべくイベントのバインドしか書かない
 */

var missions = new Missions();

/***** JSがロードされたとき *****/
(function(){
    setInterval(function(){missions.check();}, 5 * 1000);
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
    switch(dispatcher.keyword){
        case 'api_req_mission/start':
            _log('%c[ACTION DISPATCHED]%c for api_req_mission/start',true);
            action.forMissionStart(dispatcher.params);
            break;
        case 'api_req_mission/result':
            _log('%c[ACTION DISPATCHED]%c for api_req_mission/result',true);
            action.forMissionResult(dispatcher.params);
            break;
        case 'api_get_master/payitem':
            _log('%c[ACTION DISPATCHED]%c for api_get_master/payitem',true);
            action.forMasterPayitem(dispatcher.params);
        default:
            _log('%c[ACTION]%c Do Nothing for this request',true);
    }
},{'urls':[]},['requestBody']);
