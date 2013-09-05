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

/* dict{nearestEndMission, upToTimeMission} */Missions.prototype.check = function(){
    var result = {
        nearestEnd : null,
        upToTime   : []
    };
    if(this.get('missions') == undefined) return result;
    var missions = this.get('missions');
    for(var i= 0,len=missions.length; i<len;i++){
        var mjson = missions[i];
        if(mjson.finish == null) continue;
        var m = new SoloMission(mjson);
        if(m.isUpToTime()){
            this.clear(m.deck_id);
            result.upToTime.push(m);
        }
        if(result.nearestEnd == null){
            result.nearestEnd = m;
        }else if(m.getEndTime() < result.nearestEnd.getEndTime()){
            result.nearestEnd = m;
        }else{
            // do nothing
        }
    }
    return result;
}
