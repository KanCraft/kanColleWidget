var widgetPages = widgetPages || {};
(function() {
    var TimersMissionView = widgetPages.TimersMissionView = function() {
        this.attrs = {
            id    : 'time-list-wrapper-missions'
        };
        this.eventsModel = new KanColleWidget.Missions();
        this.purpose = 'mission';
        this.primaryKey = 'deck_id';
        this.nameSuffix = '艦隊';
        this.title = '- 遠征帰投予定時刻';
    };
    TimersMissionView.prototype = Object.create(widgetPages.TimersBaseView.prototype);
    TimersMissionView.prototype.constructor = TimersMissionView;
})();
