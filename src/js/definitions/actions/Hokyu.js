var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var HokyuAction = KanColleWidget.HokyuAction = function(){
        this.achievements = new KanColleWidget.Achievements(new MyStorage());
    };
    HokyuAction.prototype.forCharge= function(params){
        this.achievements.update().incrementHokyuCount();
    };
})();
