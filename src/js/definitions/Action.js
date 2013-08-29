/***** class definitions *****/

function Action(){/** APIが叩かれるときのアクション **/}

//----- mission start -----
Action.prototype.forMissionStart = function(params){
    var min = missionId_SpentTimeMin_Map[params.api_mission_id[0]];
    _presentation("ふなでだぞー\nこれが終わるのは" + min + "分後ですね");
    var d = new Date();
    var finish = new Date(d.setMinutes(d.getMinutes() + min));
    writeMissionInfo(params.api_deck_id[0], finish);
}

//----- mission result -----
Action.prototype.forMissionResult = function(){
    _presentation('かえってきたぞー');
    chrome.browserAction.setBadgeText({text:''});
}