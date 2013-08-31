/**
 * dependency: stroage/*
 */

/***** class definitions *****/
function Observer(){/*** 時間管理をします ***/
    this.targets = [
        new Missions()//missions
    ];
}

Observer.prototype.start = function(){
    _log('%cオブザーバだよーん（＾ω＾ ≡ ＾ω＾）%c',true);
    for(var i=0,len=this.targets.length; i<len; i++){
        this._start(this.targets[i]);
    }
}

Observer.prototype._start = function(target){
    setInterval(function(){
        target.check();
    }, 5 * 1000);
}