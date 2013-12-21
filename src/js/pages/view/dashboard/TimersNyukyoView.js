var widgetPages = widgetPages || {};

(function() {
    var TimersNyukyoView = widgetPages.TimersNyukyoView = function() {
        this.attrs = {
            id    : 'time-list-wrapper-nyukyos'
        };
        this.eventsModel = new KanColleWidget.Nyukyos();
        this.purpose = 'nyukyo';
        this.primaryKey = 'api_ndock_id';
        this.nameSuffix = '入渠d';
    };
    TimersNyukyoView.prototype = Object.create(widgetPages.TimersBaseView.prototype);
    TimersNyukyoView.prototype.constructor = TimersNyukyoView;
})();
