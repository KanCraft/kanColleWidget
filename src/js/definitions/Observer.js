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
            this.updateNearestEndByEachResult(result);
            this.UpToTimeEvents = this.UpToTimeEvents.concat(result.upToTime);
        }
        this.updateBadgeContext();
        this.digestUpToTimeEvents();
    };
    Observer.prototype.updateNearestEndByEachResult = function(result) {
        if (! result.nearestEnd) return;
        if (this.NearestEndEvent == null) this.NearestEndEvent = result.nearestEnd;
        if (result.nearestEnd.getEndTime() < this.NearestEndEvent.getEndTime()) {
            // 与えられたresult.nearestEndのほうが早く終わる
            this.NearestEndEvent = result.nearestEnd;
        }
        // XXX: 事後編集だとなんかちがうの？
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
        if (! this.NearestEndEvent) return;
        if(Config.get('use-badge-colorize')) {
            var badge = new KCW.ObsoleteBadgeManager(this.NearestEndEvent);
            badge.show();
        } else {
            Util.badge.leftTime(this.NearestEndEvent.getEndTime());
        }
    };
})();
