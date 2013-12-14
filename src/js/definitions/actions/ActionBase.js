var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var ActionBase = KanColleWidget.ActionBase = function(){};
    ActionBase.prototype.confirmMessage = "以下の任務が未着手です\n\n- {{title}}\n\n\n(もうこの任務について通知を出さない？)";
    ActionBase.prototype.forPreparation = function(){

        if (! Config.get("prevent-forgetting-quest")) return;
        var checker = KanColleWidget.PreChecker;
        var questNotEmbarkedYet = checker[this.precheckKeyword].check();

        if (! questNotEmbarkedYet) return;
        var message = this.confirmMessage.replace('{{title}}', questNotEmbarkedYet.title);
        Util.confirm(message, function(){
            checker.ignore(questNotEmbarkedYet.id);
        });
    };
})();
