var missionId_SpentTimeMin_Map = {
     "1" : 15,
     "2" : 30,
     "3" : 20,
     "4" : 50,
     "5" : 90,
     "6" : 40,
     "7" : 60,
     "8" : 180,
     "9" : 240,
    "10" : 90,
    "11" : 300,
    "12" : 480,
    "13" : 240,
    "14" : 360,
    "15" : 720,
    "16" : 900,
    "17" : 45,
    "18" : 300,
    "19" : 360,
    "20" : 120,
    "25" : 2400,
    "26" : 4800,
    "27" : 1200
};

var myStorage = new MyStorage();

/***** JSがロードされたとき *****/
(function(){
    setInterval(function(){checkMissions();}, 5 * 1000);
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
            _log('Action for api_req_mission/start');
            action.forMissionStart(dispatcher.params);
            break;
        case 'api_req_mission/result':
            _log('Action for api_req_mission/result');
            action.forMissionResult(dispatcher.params);
            break;
        default:
            _log('Do Nothing for this request');
    }
},{'urls':[]},['requestBody']);

/***** utilities *****/
function writeMissionInfo(deck_id, finishTime) {
    if(myStorage.get('missions') == undefined) {
        var initialValue = [{deck_id: 2, finish: null}, {deck_id: 3, finish: null}, {deck_id: 4, finish: null}];
        myStorage.set('missions', initialValue);
    }
    var missions = myStorage.get('missions');
    for(var i = 0;i < missions.length;i++) {
        if(missions[i].deck_id == deck_id)
            missions[i].finish = finishTime;
    }
    myStorage.set('missions', missions);
}

function clearMissionInfo(deck_id) {
    if(myStorage.get('missions') == undefined) return;
    var missions = myStorage.get('missions');
    for(var i = 0;i < missions.length;i++) {
        if(missions[i].deck_id == deck_id)
            missions[i].finish = null;
    }
    myStorage.set('missions', missions);
}

function checkMissions() {
    _log('Continual Mission Status Check');
    if(myStorage.get('missions') == undefined) return;
    var missions = myStorage.get('missions');
    for(var i = 0;i < (missions.length);i++) {
        if(missions[i].finish == null) continue;
        if((new Date()).getTime() > new Date(missions[i].finish).getTime()) {
            clearMissionInfo(missions[i].deck_id);
            _incrementBadge();
            _presentation("第" + missions[i].deck_id + "艦隊が遠征より帰還しました。");
        }
    }
}

//----- ウィジェットウィンドウかどうかを調べる -----
/* f(Boolean) */function _isKCWWindow(cb){
    chrome.windows.onFocusChanged.addListener(function(id){
        chrome.windows.getCurrent({populate:true},function(d){
            cb((d.tabs[0].url.match(/http[s]?:\/\/[0-9\.]+\/kcs/) != null));
        });
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
    if(myStorage.get('isDebug')) console.log(value);
}
