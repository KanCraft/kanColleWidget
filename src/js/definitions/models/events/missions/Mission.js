var KanColleWidget = KanColleWidget || {};
(function(){
    var SoloMission = KanColleWidget.SoloMission = function(missionJson){
        this.primaryId = missionJson.deck_id;
        this.finish    = missionJson.finish;
        this.prefix    = Constants.notification.mission.end_prefix;
        this.suffix    = Config.get('notification-mission-end-suffix') || Constants.notification.mission.end_suffix;
        this.kind      = 'mission-finish';
    }
    SoloMission.prototype = Object.create(KanColleWidget.SoloEventBase.prototype);
    SoloMission.prototype.constructor = KanColleWidget.SoloMission;
})();
