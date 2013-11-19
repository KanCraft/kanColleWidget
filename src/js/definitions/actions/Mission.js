/**
 * dependency: models/Missions
 */

/***** class definitions *****/

function MissionAction(){/*** mission系のAPIが叩かれたときのアクション ***/
    this.missions = new Missions();
    this.achievements = new KanColleWidget.Achievements(new MyStorage());
}

MissionAction.prototype.forStart = function(params){

    if (Config.get("enable-mission-reminder") === false) return;

    var min = Constants.time.mission[params.api_mission_id[0]];

    if (typeof min == "undefined") {
        Util.presentation("遠征ID[" + params.api_mission_id[0] + "]？知らない子ですね...");
        return;
    }

    // new format : epoch msec
    var finish = (new Date()).getTime() + (min * 60 * 1000);

    this.missions.add(params.api_deck_id[0], finish);
    this.achievements.update().incrementMissionCount();

    if(!Config.get('notification-on-reminder-set')) return;

    Util.presentation("ふなでだぞー\nこれが終わるのは" + min + "分後ですね", {
        startOrFinish: 'start',
        sound: {
            kind: 'mission-start'
        }
    });
}

MissionAction.prototype.forResult = function(params){
    chrome.browserAction.setBadgeText({text:''});
}
