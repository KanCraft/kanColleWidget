/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function Missions(){/** localStorageにあるmissionsにアクセスするクラス **/}

// extend
Missions.prototype = Object.create(MyStorage.prototype);
Missions.prototype.constructor = Missions;

/* saved: Dict */Missions.prototype.add = function(deck_id, finishTime){
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

/* success: Boolean */Missions.prototype.clear = function(deck_id){
    if(this.get('missions') == undefined) return;
    var missions = this.get('missions');
    for(var i = 0;i < missions.length;i++) {
        if(missions[i].deck_id == deck_id)
            missions[i].finish = null;
    }
    this.set('missions', missions);
}

/* void */Missions.prototype.check = function(){
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

/* f(SoloMission) */Missions.prototype.each = function(iterator){
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

/* Boolean */SoloMission.prototype.isUpToTime = function(){
    _log("isUpToTime?\t" + (new Now()).isToNotify(this.finish));
    return ((new Now()).isToNotify(this.finish));
}

/* void */SoloMission.prototype.notify = function(){
    _incrementBadge();
    _presentation("第" + this.deck_id + "艦隊がまもなく帰還します。");
}
