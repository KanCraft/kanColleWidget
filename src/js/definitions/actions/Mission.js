/**
 * dependency: models/Missions
 */

/***** class definitions *****/

function MissionAction(){/*** mission系のAPIが叩かれたときのアクション ***/
    this.missions = new Missions();
    this.achievements = new Achievements();
}

MissionAction.prototype.forStart = function(params){
    var min = Constants.time.mission[params.api_mission_id[0]];
    var d = new Date();
    var finish = new Date(d.setMinutes(d.getMinutes() + min));
    this.missions.add(params.api_deck_id[0], finish);
    this.achievements.update().incrementMissionCount();

    if(!Config.get('notification-on-reminder-set')) return;

    Util.presentation("ふなでだぞー\nこれが終わるのは" + min + "分後ですね");
}

MissionAction.prototype.forResult = function(params){
    chrome.browserAction.setBadgeText({text:''});
}
