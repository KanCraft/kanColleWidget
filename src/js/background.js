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

chrome.webRequest.onBeforeRequest.addListener(function(data){
    // TODO: 本来はここを指定のアドレスにすべき(今はリンガ泊地しかない) (いや待て、果たしてそうか？)
    var match = data.url.match(/http:\/\/[0-9\.]+\/(.*)/);
    if(data.method == 'POST' && match[1].match(/kcsapi\/api_req_mission/)){
        if(match[1].match('start')){
            // x分後にバッジをつける
            var mission_id = data.requestBody.formData.api_mission_id[0];
            if(localStorage.getItem('config_showAlert') == 'true')
                alert("ふなでだぞー\nこれが終わるのは" + missionId_SpentTimeMin_Map[mission_id] + "分後ですね");
            setTimeout(function(){
                chrome.browserAction.getBadgeText({},function(val){
                    if(val == '') val = 0;
                    var text = String(parseInt(val) + 1);
                    chrome.browserAction.setBadgeText({text:text});
                })
            },missionId_SpentTimeMin_Map[mission_id]*60*1000);
        }
        else if(match[1].match('result')){
            if(localStorage.getItem('config_showAlert') == 'true')
                alert('かえってきたぞー');
            chrome.browserAction.setBadgeText({text:''});
        }
    }
},{'urls':[]},['requestBody']);
