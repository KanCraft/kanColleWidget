var widgetPages = widgetPages || {};

(function() {
    var TimersNyukyoView = widgetPages.TimersNyukyoView = function() {
        this.tpl = '<div></div>';
        this.events = {};
        this.attrs = {
            id    : 'time-list-wrapper-nyukyos',
            class : 'time-list'
        };
        this.nyukyos = new KanColleWidget.Nyukyos();
    };
    TimersNyukyoView.prototype = Object.create(widgetPages.View.prototype);
    TimersNyukyoView.prototype.constructor = TimersNyukyoView;
    TimersNyukyoView.prototype.render = function(){
        this.apply()._render();
        this.renderTimers(this.nyukyos.getAll());
        return this.$el;
    };
    TimersNyukyoView.prototype.renderTimers = function(nyukyos){
        this.$el.find('ul').remove();
        var $ul = $('<ul></ul>').addClass('time-list-container');
        var $lis = [];
        for(var i in nyukyos){
            var timerView = new widgetPages.TimerView(
                "nyukyo","api_ndock_id",nyukyos[i]
            );
            $lis.push(timerView.render("入渠d"));
        }
        this.$el.append($ul.append($lis));
    };
    TimersNyukyoView.prototype.update = function(){
        this.renderTimers(this.nyukyos.getAll());
    };
})();
