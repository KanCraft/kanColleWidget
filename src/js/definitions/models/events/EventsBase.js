/**
 * dependency: MyStorage
 */

/***** abstract class definition *****/

/**
 * @interface primaryIdName ドックや艦隊の識別子の名前
 * @interface storageName   localStorageに保存される名前
 * @interface soloModel     イベントのソロモデルの定義
 * @interface initialValue  最初に入る値: Array
 */
function EventsBase(){/** リマインダが必要になるlocalStorageに保存するイベントへの基底クラス **/}

// extend
EventsBase.prototype = Object.create(MyStorage.prototype);
EventsBase.prototype.constructor = EventsBase;


/**
 * @param primary_id
 * @param finishTime
 */
// プライマリキーと終了時間を受け取って、配列にSoloEventオブジェクトを追加する
EventsBase.prototype.add = function(id, finishTime){
    if(this.get(this['storageName']) == 'undefined'){
        this.set(this['storageName'], this.initialValue);
    }
    var events = this.get(this.storageName) || this.initialValue;
    for(var i = 0;i<events.length; i++){
        if(events[i][this.primaryIdName] == id)
            events[i].finish = finishTime;
    }
    this.set(this.storageName, events);
}

// プライマリーキーを受け取って、終了時間をnullにする
EventsBase.prototype.clear = function(id){
    var events = this.get(this.storageName) || this.initialValue;
    for(var i=0;i<events.length;i++){
        if(events[i][this.primaryIdName] == id)
            events[i].finish = null;
    }
    this.set(this.storageName, events);
}

// 全てのイベントをチェックして直近終わるものと終わっているものを返す
EventsBase.prototype.check = function(){
    var result = {
        nearestEnd : null,
        upToTime   : []
    };
    var events = this.get(this.storageName) || this.initialValue;
    for(var i=0;i<events.length;i++){
        var json = events[i];
        if(json.finish == null) continue;
        var e = new this.soloModel(json);
        if(e.isUpToTime()){
            this.clear(e.primaryId);
            result.upToTime.push(e);
        }
        if(result.nearestEnd == null){
            result.nearestEnd = e;
        }else if(e.getEndTime() < result.nearestEnd.getEndTime()){
            result.nearestEnd = e;
        }else{
            // do nothing
        }
    }
    return result;
}
