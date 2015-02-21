var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var RemodelAction = KanColleWidget.RemodelAction = function(){
        this.achievements = new KanColleWidget.Achievements(new MyStorage());
        this.precheckKeyword = 'remodelQuest';
    };
    RemodelAction.prototype = Object.create(KanColleWidget.ActionBase.prototype);
    RemodelAction.prototype.constructor = RemodelAction;

    RemodelAction.prototype.forStart = function(){
        this.achievements.update().incrementRemodelCount();
    };
})();
