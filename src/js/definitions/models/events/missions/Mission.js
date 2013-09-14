/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function SoloMission(missionJson){
    this.deck_id = missionJson.deck_id;
    this.finish  = missionJson.finish;
}

/* Boolean */SoloMission.prototype.isUpToTime = function(){
    return ((new Now()).isToNotify(this.finish));
}

/* void */SoloMission.prototype.notify = function(){
	var prefix = Constants.notification.mission.end_prefix;
	var suffix = Config.get('notification-mission-end-suffix') || Constants.notification.mission.end_suffix;
    Util.presentation(prefix + this.deck_id + suffix);
}

/* int: Epoch */SoloMission.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}
