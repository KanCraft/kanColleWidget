var KanColleWidget = KanColleWidget || {};
(function(){
    var SoloMission = KanColleWidget.SoloMission = function(missionJson){
        this.title     = (missionJson.info) ? missionJson.info.title : '登録なし(´･ω･`)';
        this.primaryId = missionJson.deck_id;
        this.finish    = missionJson.finish;
        this.prefix    = Constants.notification.mission.end_prefix;
        this.suffix    = Config.get('notification-mission-end-suffix') || Constants.notification.mission.end_suffix;
        this.kind      = 'mission-finish';
        this.label     = '遠征帰投';
    }
    SoloMission.prototype = Object.create(KanColleWidget.SoloEventBase.prototype);
    SoloMission.prototype.constructor = KanColleWidget.SoloMission;
    SoloMission.prototype.getFooterMess = function() {
        var mess = "【" + this.title + "】";
        return "\n" + mess;
    };
})();
