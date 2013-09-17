/***** class definitions *****/
function SoloEventBase(){}
/* boolean */SoloEventBase.prototype.isUpToTime = function(){
    var now    = (new Date()).getTime();
    var finish = (new Date(this.finish)).getTime();
    return (finish < now);
}
/* int: Epoch */SoloEventBase.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}
/* void */SoloEventBase.prototype.notify = function(){

    if(!Config.get('notification-on-reminder-finish')) return;

    Util.presentation(this.prefix + this.primaryId + this.suffix);
}