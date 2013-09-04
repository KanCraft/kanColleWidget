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
    _presentation("第" + this.api_kdock_id + "建造ドックでの作業がまもなく終了します");
}

/* int: Epoch */SoloCreateship.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}
