var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var KaisouAction = KanColleWidget.KaisouAction = function(){
        this.achievements = new KanColleWidget.Achievements(new MyStorage());
    };
    KaisouAction.prototype.forPowerup = function(params){
        this.achievements.update().incrementKaisouCount();
    };
})();
