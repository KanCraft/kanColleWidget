var widgetPages = widgetPages || {};
(function() {
    var TimersCreateshipView = widgetPages.TimersCreateshipView = function(isSelectPage) {
        this.attrs = {
            id    : 'time-list-wrapper-createships'
        };
        this.eventsModel = new KanColleWidget.Createships();
        this.purpose = 'createship';
        this.primaryKey = 'api_kdock_id';
        this.nameSuffix = '建造d';
        this.title = '- 建造完了予定時刻';
        this.isSelectPage = isSelectPage;
    };
    Util.extend(TimersCreateshipView, widgetPages.TimersBaseView);
})();
