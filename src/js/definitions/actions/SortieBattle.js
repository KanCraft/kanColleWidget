var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var SortieBattleAction = KanColleWidget.SortieBattleAction = function(){
    };
    SortieBattleAction.prototype.forResult = function(){
        var process = new KanColleWidget.Process.OpenShipsStatus();
        setTimeout(function(){
            process.open();
        },2000);
    };
})();
