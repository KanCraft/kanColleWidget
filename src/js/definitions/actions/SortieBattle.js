var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var SortieBattleAction = KanColleWidget.SortieBattleAction = function(){
    };
    SortieBattleAction.prototype.forResult = function(){

        if (! Config.get('show-ships-status')) return;

        setTimeout(function(){
            KCW.ShipsStatusWindow.show();
        },3000);
        // 3200 でもギリの時があった
    };
    SortieBattleAction.prototype.forBattle = function(){
        KCW.ShipsStatusWindow.sweep();
    };
})();
