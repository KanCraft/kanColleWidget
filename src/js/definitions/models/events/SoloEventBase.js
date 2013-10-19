/***** class definitions *****/
function SoloEventBase(){}
/* boolean */SoloEventBase.prototype.isUpToTime = function(){
    var now    = (new Date()).getTime();

    // migration : mission.finish (date object -> epoch msec)
    if(typeof this.finish != 'number') this.finish = (new Date(this.finish)).getTime();

    var notifyOffset = Config.get('notification-offset-millisec');

    var finish = this.finish - notifyOffset;

    return (finish < now);
}
/* int: Epoch */SoloEventBase.prototype.getEndTime = function(){

    // migration : mission.finish (date object -> epoch msec)
    if(typeof this.finish != 'number') this.finish = (new Date(this.finish)).getTime();

    return this.finish;
}
/* void */SoloEventBase.prototype.notify = function(){

    if(!Config.get('notification-on-reminder-finish')) return;

    Util.presentation(this.prefix + this.primaryId + this.suffix, {
        startOrFinish: 'finish',
        sound: {
            kind: this.kind
        }
    });
}
