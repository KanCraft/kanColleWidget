/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function Missions(){/** localStorageにあるmissionsにアクセスするクラス **/}

// extend
Missions.prototype = Object.create(MyStorage.prototype);
Missions.prototype.constructor = Missions;

/* saved: Dict */
Missions.prototype.add = function(deck_id, finishTime){
    if(this.get('missions') == undefined) {
        var initialValue = [{deck_id: 2, finish: null}, {deck_id: 3, finish: null}, {deck_id: 4, finish: null}];
        this.set('missions', initialValue);
    }
    var missions = this.get('missions');
    for(var i = 0;i < missions.length;i++) {
        if(missions[i].deck_id == deck_id)
            missions[i].finish = finishTime;
    }
    this.set('missions', missions);
}

/* success: Boolean */
Missions.prototype.clear = function(deck_id){
    if(this.get('missions') == undefined) return;
    var missions = this.get('missions');
    for(var i = 0;i < missions.length;i++) {
        if(missions[i].deck_id == deck_id)
            missions[i].finish = null;
    }
    this.set('missions', missions);
}

/* void */
Missions.prototype.check = function(){
    _log('Continual Mission Status Check');
    if(this.get('missions') == undefined) return;
    var missions = this.get('missions');
    var self = this;
    this.each(function(mjson){
        if(mjson.finish == null) return;
        var m = new SoloMission(mjson);
        if(m.isUpToTime()){
            self.clear(m.deck_id);
            m.notify();
        }
    });
}

Missions.prototype.each = function(iterator){
    var missions = this.get('missions');
    for(var i = 0;i < missions.length;i++) {
        iterator(missions[i]);
    }
}

/***** class definitions *****/
function SoloMission(missionJson){
    this.deck_id = missionJson.deck_id;
    this.finish  = missionJson.finish;
}

SoloMission.prototype.isUpToTime = function(){
    console.log((new Now()).isToNotify(this.finish));
    return ((new Now()).isToNotify(this.finish));
}

SoloMission.prototype.notify = function(){
    _incrementBadge();
    _presentation("第" + this.deck_id + "艦隊がまもなく帰還します。");
}

/***** class definitions *****/
function Now(){
    this.time = (new Date()).getTime();
};
Now.prototype.isToNotify = function(finish_time){
    var ahead_msec = (1 * 60 - 20) * 1000;//TODO: 設定から拾う
    var when_to_notify = (new Date(finish_time)).getTime() - ahead_msec;
    return (this.time > when_to_notify);
}
