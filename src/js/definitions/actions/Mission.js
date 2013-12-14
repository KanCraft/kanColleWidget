var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var MissionAction = KanColleWidget.MissionAction = function(){
        this.missions = new KanColleWidget.Missions();
        this.achievements = new KanColleWidget.Achievements(new MyStorage());
        this.precheckKeyword = 'missionQuest';
    };
    MissionAction.prototype = Object.create(KanColleWidget.ActionBase.prototype);
    MissionAction.prototype.constructor = MissionAction;

    MissionAction.prototype.forStart = function(params){

        if (Config.get("enable-mission-reminder") === false) return;

        var min = Constants.time.mission[params.api_mission_id[0]];
        if (typeof min == "undefined") {
            Util.presentation("遠征ID[" + params.api_mission_id[0] + "]？知らない子ですね...");
            return;
        }

        var finish = Date.now() + (min * 60 * 1000);

        this.missions.add(params.api_deck_id[0], finish);
        this.achievements.update().incrementMissionCount();

        if(!Config.get('notification-on-reminder-set')) return;

        Util.presentation("ふなでだぞー\nこれが終わるのは" + min + "分後ですね", {
            startOrFinish: 'start',
            sound: {
                kind: 'mission-start'
            }
        });
    };
    MissionAction.prototype.forResult = function(params){
        // うわぁぁここのchromeどうしよぅぅぅ
        chrome.browserAction.setBadgeText({text:''});
    };
})();
