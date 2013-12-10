var KanColleWidget = KanColleWidget || {};
(function(){
    var Missions = KanColleWidget.Missions = function(){
        this.primaryIdName = 'deck_id';
        this.storageName   = 'missions';
        this.soloModel     = KanColleWidget.SoloMission;
        this.initialValue  = [
            {deck_id: 2, finish: null},
            {deck_id: 3, finish: null},
            {deck_id: 4, finish: null}
        ];
    };
    // extend
    Missions.prototype = Object.create(EventsBase.prototype);
    Missions.prototype.constructor = KanColleWidget.Missions;
})();
