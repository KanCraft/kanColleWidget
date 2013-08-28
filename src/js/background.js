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

function writeMissionInfo(fleetNumber, finishTime) {
    if(localStorage.missions == undefined) {
        var initialValue = [{fleetNumber: 2, finish: null}, {fleetNumber: 3, finish: null}, {fleetNumber: 4, finish: null}];
        localStorage.missions = JSON.stringify(initialValue);
    }
    var missions = JSON.parse(localStorage.missions);
    for(var i = 0;i < missions.length;i++) {
        if(missions[i].fleetNumber == fleetNumber)
            missions[i].finish = finishTime;
    }
    localStorage.missions = JSON.stringify(missions);
}

function clearMissionInfo(fleetNumber) {
    if(localStorage.missions == undefined) return;
    var missions = JSON.parse(localStorage.missions);
    for(var i = 0;i < missions.length;i++) {
        if(missions[i].fleetNumber == fleetNumber)
            missions[i].finish = null;
    }
    localStorage.missions = JSON.stringify(missions);
}

function checkMissions() {
    if(localStorage.getItem('config_showAlert') == 'false') return;
    if(localStorage.missions == undefined) return;
    var missions = JSON.parse(localStorage.missions);
    for(var i = 0;i < (missions.length);i++) {
        if(missions[i].finish == null) continue;
        if((new Date()).getTime() > new Date(missions[i].finish).getTime()) {
            clearMissionInfo(missions[i].fleetNumber);
            alert("第" + missions[i].fleetNumber + "艦隊が遠征より帰還しました。");
        }
    }
}

chrome.webRequest.onBeforeRequest.addListener(function(data,hoge,fuga){
    // TODO: 本来はここを指定のアドレスにすべき(今はリンガ泊地しかない)
    var match = data.url.match(/http:\/\/[0-9\.]+\/(.*)/);
    if(data.method == 'POST' && match[1].match(/kcsapi\/api_req_mission/)){
        
        if(match[1].match('start')){
            // x分後にバッジをつける
            var mission_id = data.requestBody.formData.api_mission_id[0];
            var fleetNumber = data.requestBody.formData.api_deck_id[0]

            if(localStorage.getItem('config_showAlert') == 'true'){
                alert("ふなでだぞー\nこれが終わるのは" + missionId_SpentTimeMin_Map[mission_id] + "分後ですね");
                var d = new Date();
                var finish = new Date(d.setMinutes(d.getMinutes() + missionId_SpentTimeMin_Map[mission_id]));
                writeMissionInfo(fleetNumber, finish);
            }

        }
    }
},{'urls':[]},['requestBody']);


setInterval(function(){checkMissions();}, 5 * 1000);

