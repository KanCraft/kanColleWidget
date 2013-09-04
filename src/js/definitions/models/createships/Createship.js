/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function SoloCreatesihp(createshipJson){
    this.api_kdock_id = createshipJson.api_kdock_id;
    this.finish  = createshipJson.finish;
}

/* Boolean */SoloCreatesihp.prototype.isUpToTime = function(){
    return ((new Now()).isToNotify(this.finish));
}

/* void */SoloCreatesihp.prototype.notify = function(){
    _presentation("第" + this.api_kdock_id + "建造ドックでの作業がまもなく終了します");
}

/* int: Epoch */SoloCreateship.prototype.getEndTime = function(){
    return (new Date(this.finish)).getTime();
}
