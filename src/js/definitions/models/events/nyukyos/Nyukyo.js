/***** class definitions *****/
function SoloNyukyo(json){
    this.api_ndock_id = json.api_ndock_id;
    this.finish  = json.finish;
}

/* Boolean */SoloNyukyo.prototype.isUpToTime = function(){
    return ((new Now()).isToNotify(this.finish));
}

/* void */SoloNyukyo.prototype.notify = function(){
    _presentation("第" + this.api_ndock_id + "番入渠ドックの修復作業がまもなく完了します");
}

/* int: Epoch */SoloNyukyo.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}
