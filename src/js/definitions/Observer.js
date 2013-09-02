/**
 * dependency: stroage/*
 */

/***** class definitions *****/
function Observer(){/*** 時間管理をします ***/
    this.targets = [
        new Missions()//missions
    ];
    this.NearestEndEvent = null; /* SoloEvent */
    this.UpToTimeEvents   = []; /* SoloEvent[] */
}

Observer.prototype.start = function(){
    var self = this;
    setInterval(function(){
        self.checkAll();
    }, 5 * 1000);
}

Observer.prototype.checkAll = function(){
    /** このforの中はなんとしてもsync堅守 */
    for(var i= 0,len=this.targets.length; i<len; i++){
        var task = this.targets[i];
        var result = task.check();
        if(this.NearestEndEvent == null){
            this.NearestEndEvent = result.nearestEnd;
        }
        else if(result.nearestEnd == null){
            // do nothing
        }
        else if(result.nearestEnd.getEndTime() < this.NearestEndEvent.getEndTime()){
            this.NearestEndEvent = result.nearestEnd;
        }else{
            // do nothing
        }
        this.UpToTimeEvents = this.UpToTimeEvents.concat(result.upToTime);
    }
    _log('%c直近で終わるイベント%c',true);
    _log(this.NearestEndEvent);
    //---> で、ここでこれらを消化してクリアする
    this.updateBadgeContext();
    this.digestUpToTimeEvents();
}

Observer.prototype.digestUpToTimeEvents = function(){
    _log('%c終わったイベント%c',true);
    for(var i= 0,len=this.UpToTimeEvents.length; i<len; i++){
        var e = this.UpToTimeEvents[i];
        _log(e);
        e.notify();
    }
    if(this.NearestEndEvent == null || this.NearestEndEvent.isUpToTime()) this.NearestEndEvent = null;
    this.UpToTimeEvents = [];
}

Observer.prototype.updateBadgeContext = function(){
    if(true){ // nearestをひょうじするか？
        if(this.NearestEndEvent){
            badgeLeftTime(this.NearestEndEvent.getEndTime());
        }
    }else{ // upToTImeの数を表示するか？
        console.log('ここでupToTimeの数をだな');
    }
}
