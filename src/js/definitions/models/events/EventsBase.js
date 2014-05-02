var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    /**
     * @interface primaryIdName ドックや艦隊の識別子の名前
     * @interface storageName   localStorageに保存される名前
     * @interface soloModel     イベントのソロモデルの定義
     * @interface initialValue  最初に入る値: Array
     */
    var EventsBase = KanColleWidget.EventsBase = function(){};
    // extend
    EventsBase.prototype = Object.create(MyStorage.prototype);
    EventsBase.prototype.constructor = EventsBase;

    /**
     * プライマリキーと終了時間を受け取って、配列にSoloEventオブジェクトを追加する
     * @param primary_id
     * @param finishTime
     */
    EventsBase.prototype.add = function(id, finishTime, optionalInfo){
        var events = this.get(this.storageName) || this.initialValue;
        for(var i = 0;i<events.length; i++){
            if(events[i][this.primaryIdName] == id) {
                events[i].finish = finishTime;
                if(optionalInfo) events[i].info = optionalInfo;

                this.enqueue(new this.soloModel(events[i]));
            }
        }
        this.set(this.storageName, events);
    };
    EventsBase.prototype.enqueue = function(soloEventModel) {
        if (! soloEventModel.isTwitterRemindEnabled()) return;
        // ServiceTweetKCWidgetを叩く
        var s = new KanColleWidget.ServiceTweetKCWidget();
        s.enqueueEvent(soloEventModel);
    };
    /**
     * 自分で管理しているeventsを全部返す
     * @returns {*|Array}
     */
    EventsBase.prototype.getAll = function(){
        var events = this.get(this.storageName) || this.initialValue;
        return Util.sortEvents(events);
    };

    /**
     * プライマリーキーを受け取って、終了時間をnullにする
     * @param id
     */
    EventsBase.prototype.clear = function(id){
        var events = this.get(this.storageName) || this.initialValue;
        for(var i=0;i<events.length;i++){
            if(events[i][this.primaryIdName] == id)
                events[i].finish = null;
        }
        this.set(this.storageName, events);
    };

    /**
     * 全てのイベントをチェックして直近終わるものと終わっているものを返す
     * @returns {{nearestEnd: null, upToTime: Array}}
     */
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
    };
})();
