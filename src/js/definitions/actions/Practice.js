var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var PracticeAction = KanColleWidget.PracticeAction = function(){
        this.achievements = new KanColleWidget.Achievements(new KanColleWidget.MyStorage());
        this.precheckKeyword = 'practiceQuest';
    };
    PracticeAction.prototype = Object.create(KanColleWidget.ActionBase.prototype);
    PracticeAction.prototype.constructor = PracticeAction;

    PracticeAction.prototype.forBattle= function(){
        this.achievements.update().incrementPracticeCount();
    };
})();
