var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var SortieBattleAction = KanColleWidget.SortieBattleAction = function(){
    };
    SortieBattleAction.prototype.forResult = function(){

        if (! Config.get('show-ships-status')) return;

        var process = new KanColleWidget.Process.OpenShipsStatus();
        setTimeout(function(){
            process.open();
        },3000);
        // 3200 でもギリの時があった
    };
    SortieBattleAction.prototype.forBattle = function(){
        this._clearShipsStatusWindow();
    };
    SortieBattleAction.prototype._clearShipsStatusWindow = function(){
        if (KanColleWidget.Stash.statusWindow
            && KanColleWidget.Stash.statusWindow.close) {
            KanColleWidget.Stash.statusWindow.close();
        }
        KanColleWidget.Stash.statusWindow = null;
    };
})();
