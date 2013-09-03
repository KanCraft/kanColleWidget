/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function SoloMission(missionJson){
    this.deck_id = missionJson.deck_id;
    this.finish  = missionJson.finish;
}

/* Boolean */SoloMission.prototype.isUpToTime = function(){
    _log("isUpToTime?\t" + (new Now()).isToNotify(this.finish));
    return ((new Now()).isToNotify(this.finish));
}

/* void */SoloMission.prototype.notify = function(){
    _presentation("第" + this.deck_id + "艦隊がまもなく帰還します。");
}

/* int: Epoch */SoloMission.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}