var widgetPages = widgetPages || {};
(function() {
    var TimersNyukyoView = widgetPages.TimersNyukyoView = function(isSelectPage) {
        this.attrs = {
            id    : 'time-list-wrapper-nyukyos'
        };
        this.eventsModel = new KanColleWidget.Nyukyos();
        this.purpose = 'nyukyo';
        this.primaryKey = 'api_ndock_id';
        this.nameSuffix = '入渠d';
        this.title = '- 入渠完了予定時刻';
        this.isSelectPage = isSelectPage;
    };
    TimersNyukyoView.prototype = Object.create(widgetPages.TimersBaseView.prototype);
    TimersNyukyoView.prototype.constructor = TimersNyukyoView;
})();
