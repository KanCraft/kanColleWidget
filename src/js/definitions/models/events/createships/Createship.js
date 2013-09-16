/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function SoloCreateship(createshipJson){
    this.api_kdock_id = createshipJson.api_kdock_id;
    this.finish  = createshipJson.finish;
}

/* Boolean */SoloCreateship.prototype.isUpToTime = function(){
    return ((new Now()).isToNotify(this.finish));
}

/* void */SoloCreateship.prototype.notify = function(){

    if(!Config.get('notification-on-reminder-finish')) return;

    var prefix = Constants.notification.createship.end_prefix;
    var suffix = Config.get('notification-createship-end-suffix') || Constants.notification.createship.end_suffix;
    Util.presentation(prefix + this.api_kdock_id + suffix);
}

/* int: Epoch */SoloCreateship.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}
