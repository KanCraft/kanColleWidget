/***** class definitions *****/
function SoloEventBase(){}
/* boolean */SoloEventBase.prototype.isUpToTime = function(){
    var now    = (new Date()).getTime();

    // migration : mission.finish (date object -> epoch msec)
    if(typeof this.finish != 'number') this.finish = (new Date(this.finish)).getTime();

    var finish = this.finish - Constants.time.notifyOffset;

    return (finish < now);
}
/* int: Epoch */SoloEventBase.prototype.getEndTime = function(){

    // migration : mission.finish (date object -> epoch msec)
    if(typeof this.finish != 'number') this.finish = (new Date(this.finish)).getTime();

    return this.finish;
}
/* void */SoloEventBase.prototype.notify = function(){

    if(!Config.get('notification-on-reminder-finish')) return;

    Util.presentation(this.prefix + this.primaryId + this.suffix);
}