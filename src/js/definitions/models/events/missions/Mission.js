/***** class definitions *****/
function SoloMission(missionJson){
    this.primaryId = missionJson.deck_id;
    this.finish    = missionJson.finish;
    this.prefix    = Constants.notification.mission.end_prefix;
    this.suffix    = Config.get('notification-mission-end-suffix') || Constants.notification.mission.end_suffix;
}
SoloMission.prototype = Object.create(SoloEventBase.prototype);
SoloMission.prototype.constructor = SoloMission;