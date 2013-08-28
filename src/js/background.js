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

/***** Main Listener 01 : ウィジェットウィンドウがフォーカスされた時 *****/
chrome.windows.onFocusChanged.addListener(function(id){
    _isKCWWindow(function(isKCW){
        if(isKCW){
            chrome.browserAction.setBadgeText({text:''});
        }
    });
});

/***** Main Listener 02 : ブラウザからHTTPRequestが送信される時 *****/
chrome.webRequest.onBeforeRequest.addListener(function(data){
    var dispatcher = _parseRequestData(data);
    var action     = new Action();
    switch(dispatcher.keyword){
        case 'api_req_mission/start':
            action.forMissionStart(dispatcher.params);
            break;
        case 'api_req_mission/result':
            action.forMissionResult(dispatcher.params);
            break;
        default:
            console.log('Do Nothing for this request');
    }
},{'urls':[]},['requestBody']);

/***** class definitions *****/
function Action(){/** APIが叩かれるときのアクション **/}
//----- mission start -----
Action.prototype.forMissionStart = function(params){
    var min = missionId_SpentTimeMin_Map[params.api_mission_id[0]];
    _presentation("ふなでだぞー\nこれが終わるのは" + min + "分後ですね");
    var schedule = new Schedule(min);
    schedule.incrementRedBadge({}).set();
}
//----- mission result -----
Action.prototype.forMissionResult = function(){
    _presentation('かえってきたぞー');
    chrome.browserAction.setBadgeText({text:''});
}

/***** class definitions *****/
function Schedule(minute){/** タイマー的に引きおこすアクション **/
    this.msec      = minute*60*1000;
}
//----- increment red badge -----
Schedule.prototype.incrementRedBadge = function(option){
    this.execution = function(){
        chrome.browserAction.getBadgeText({},function(val){
            if(val == '') val = 0;
            var text = String(parseInt(val) + 1);
            chrome.browserAction.setBadgeText({text:text});
        });
    }
    return this;
}
Schedule.prototype.set = function(){
    return setTimeout(this.execution, this.msec);
}

/* void */function _presentation(text){
    if(localStorage.getItem('config_showAlert') == 'true')
        alert(text);
}

/***** utilities *****/
//----- ウィジェットウィンドウかどうかを調べる -----
/* f(Boolean) */function _isKCWWindow(cb){
    chrome.windows.onFocusChanged.addListener(function(id){
       chrome.windows.getCurrent({populate:true},function(d){
           var is_kc_window = (d.tabs[0].url.match(/http[s]?:\/\/[0-9\.]+\/kcs/) != null);
           if(is_kc_window){
               cb(true);
           }else{
               cb(false);
           }
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
