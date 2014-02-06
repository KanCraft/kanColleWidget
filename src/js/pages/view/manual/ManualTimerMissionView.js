var widgetPages = widgetPages || {};
(function(){
    var ManualTimerMissionView = widgetPages.ManualTimerMissionView = function(params){
        this.modelName = 'mission';
        this.model = new KanColleWidget.Missions();
        this.purpose = '遠征';
        this.identifier = params['deck_id'];
        this.identifierName = "第" + this.identifier + "艦隊";
        this.tracked = {hour:0,minute:20};
        this.kind = 'mission-start';
    };
    Util.extend(ManualTimerMissionView, widgetPages.ManualTimerView);
})();
