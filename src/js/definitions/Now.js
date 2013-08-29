/***** class definitions *****/
function Now(){
    this.time = (new Date()).getTime();
};

/* Boolean */Now.prototype.isToNotify = function(finish_time){
    var ahead_msec = (1 * 60 - 10) * 1000;//TODO: 設定から拾う
    var when_to_notify = (new Date(finish_time)).getTime() - ahead_msec;
    return (this.time > when_to_notify);
}