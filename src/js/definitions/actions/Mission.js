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

        if (params.manual) {
            return this.setManually(
                this.missions,
                'mission-start',
                params
            );
        }

        this.achievements.update().incrementMissionCount();

        if (Config.get("enable-mission-reminder") === false) return;

        var mission = Constants.mission[params.api_mission_id[0]];
        if (typeof mission == "undefined") {
            Util.presentation("遠征ID[" + params.api_mission_id[0] + "]？知らない子ですね...");
            return;
        }

        var min = mission.minute;

        var finish = Date.now() + (min * 60 * 1000);
        var optionalInfo = {title: mission.title, missionId: params.api_mission_id[0]};

        this.missions.add(params.api_deck_id[0], finish, optionalInfo);

        if(!Config.get('notification-on-reminder-set')) return;

        var word = Config.get('text-on-mission-start');
        Util.presentation(word + "\nこれが終わるのは" + min + "分後ですね", {
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
