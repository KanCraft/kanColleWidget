/**
 * dependency: Missions
 */

/***** class definitions *****/

function Action(){/** APIが叩かれるときのアクション **/
    this.missions = new Missions();
}

//----- mission start -----
Action.prototype.forMissionStart = function(params){
    //var min = missionId_SpentTimeMin_Map[params.api_mission_id[0]];
    var min = CMap.missionId_timeUsage[params.api_mission_id[0]];
    _presentation("ふなでだぞー\nこれが終わるのは" + min + "分後ですね");
    var d = new Date();
    var finish = new Date(d.setMinutes(d.getMinutes() + min));
    this.missions.add(params.api_deck_id[0], finish);
}

//----- mission result -----
Action.prototype.forMissionResult = function(){
    chrome.browserAction.setBadgeText({text:''});
}