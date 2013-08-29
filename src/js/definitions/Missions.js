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
    for(var i = 0;i < (missions.length);i++) {
        if(missions[i].finish == null) continue;
        if((new Date()).getTime() > new Date(missions[i].finish).getTime()) {
            this.clear(missions[i].deck_id);
            _incrementBadge();
            _presentation("第" + missions[i].deck_id + "艦隊が遠征より帰還しました。");
        }
    }
}
