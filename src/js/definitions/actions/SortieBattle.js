var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var SortieBattleAction = KanColleWidget.SortieBattleAction = function(){
    };
    SortieBattleAction.prototype.forResult = function(params){

        if (! Config.get('show-ships-status')) return;

        if (params.combined) {
            KCW.sendMessageToContentScript({
                purpose: 'listenClick'
            });
        }

        setTimeout(function(){
            KCW.ShipsStatusWindow.show();
        },3000);
        // 3200 でもギリの時があった
    };
    SortieBattleAction.prototype.forBattle = function(){
        KCW.ShipsStatusWindow.sweep();
    };
})();
