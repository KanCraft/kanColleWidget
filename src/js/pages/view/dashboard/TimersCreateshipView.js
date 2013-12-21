var widgetPages = widgetPages || {};
(function() {
    var TimersCreateshipView = widgetPages.TimersCreateshipView = function() {
        this.attrs = {
            id    : 'time-list-wrapper-createships'
        };
        this.eventsModel = new KanColleWidget.Createships();
        this.purpose = 'createship';
        this.primaryKey = 'api_kdock_id';
        this.nameSuffix = '建造d';
    };
    TimersCreateshipView.prototype = Object.create(widgetPages.TimersBaseView.prototype);
    TimersCreateshipView.prototype.constructor = TimersCreateshipView;
})();
