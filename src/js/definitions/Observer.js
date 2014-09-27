var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var Observer = KanColleWidget.Observer = function(){
        this.targets = [
            new KanColleWidget.Missions(), // 遠征
            new KanColleWidget.Createships(), // 建造
            new KanColleWidget.Nyukyos(), // 入渠
            new KanColleWidget.Sorties(), // 出撃からの経過時間
        ];
        this.NearestEndEvent = null; /* SoloEvent */
        this.UpToTimeEvents   = []; /* SoloEvent[] */
    };
    Observer.prototype.start = function(){
        var self = this;
        setInterval(function(){
            self.checkAll();
        }, 5 * 1000);
    };
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
            }
            else if(result.nearestEnd.primaryId == this.NearestEndEvent.primaryId){
                // 事後編集されたっぽい
                if (result.nearestEnd.kind == this.NearestEndEvent.kind) {
                    this.NearestEndEvent = result.nearestEnd;
                }
            }else{
                // do nothing
            }
            this.UpToTimeEvents = this.UpToTimeEvents.concat(result.upToTime);
        }
        this.updateBadgeContext();
        this.digestUpToTimeEvents();
    };
    Observer.prototype.digestUpToTimeEvents = function(){
        for(var i= 0,len=this.UpToTimeEvents.length; i<len; i++){
            var e = this.UpToTimeEvents[i];
            e.notify();
        }
        this.unsetNearestEndEvent();
        this.UpToTimeEvents = [];
    };
    Observer.prototype.unsetNearestEndEvent = function(){
        if(this.NearestEndEvent == null || this.NearestEndEvent.isUpToTime()) this.NearestEndEvent = null;
    };
    Observer.prototype.updateBadgeContext = function(){
        switch (Config.get('badge-style')) {
            case '1':
                return this.updateBadgeByNearestEndTime();
            case '2':
                return this.updateBadgeByNearestEndTimeWithoutColorize();
            case '3':
                return this.updateBadgeByUpToTimeEventsCount();
            default:
                return "do nothing";
        }
    };
    Observer.prototype.updateBadgeByUpToTimeEventsCount = function() {
        var badge = new KCW.ObsoleteBadgeManager();
        badge.incrementByCount(this.UpToTimeEvents.length);
    };
    Observer.prototype.updateBadgeByNearestEndTime = function() {
        if (! this.NearestEndEvent) return;
        var badge = new KCW.ObsoleteBadgeManager(this.NearestEndEvent);
        badge.show();
    };
    Observer.prototype.updateBadgeByNearestEndTimeWithoutColorize = function() {
        if (! this.NearestEndEvent) return;
        Util.badge.leftTime(this.NearestEndEvent.getEndTime());
    };
})();
