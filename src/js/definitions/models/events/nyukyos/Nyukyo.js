/***** class definitions *****/
function SoloNyukyo(json){
    this.api_ndock_id = json.api_ndock_id;
    this.finish  = json.finish;
}

/* Boolean */SoloNyukyo.prototype.isUpToTime = function(){
    return ((new Now()).isToNotify(this.finish));
}

/* void */SoloNyukyo.prototype.notify = function(){
	var prefix = Constants.notification.nyukyo.end_prefix;
	var suffix = Config.get('notification-nyukyo-end-suffix') || Constants.notification.nyukyo.end_suffix;
    Util.presentation(prefix + this.api_ndock_id + suffix);
}

/* int: Epoch */SoloNyukyo.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}
