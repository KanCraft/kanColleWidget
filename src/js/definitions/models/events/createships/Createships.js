var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var Createships = KanColleWidget.Createships = function(){
        this.primaryIdName = 'api_kdock_id';
        this.storageName   = 'createships';
        this.soloModel     = KanColleWidget.SoloCreateship;
        this.initialValue  = [
            {api_kdock_id: 1, finish: null},
            {api_kdock_id: 2, finish: null},
            {api_kdock_id: 3, finish: null},
            {api_kdock_id: 4, finish: null}
        ];
    };
    Createships.prototype = Object.create(EventsBase.prototype);
    Createships.prototype.constructor = Createships;
})();
