var widgetPages = widgetPages || {};

(function() {
    var TimersView = widgetPages.TimersView = function(isSelectPage) {
        this.tpl = '<div></div>';
        this.events = {};
        this.attrs = {
            id    : 'time-left',
            class : 'contents boxy'
        };
        this.timersMissionView = new widgetPages.TimersMissionView(isSelectPage);
        this.timersNyukyoView = new widgetPages.TimersNyukyoView(isSelectPage);
        this.timersCreateshipView = new widgetPages.TimersCreateshipView(isSelectPage);
    };
    Util.extend(TimersView, widgetPages.View);
    TimersView.prototype.constructor = TimersView;
    TimersView.prototype.render = function(){
        this.apply()._render();
        this.$el.append(
            this.timersMissionView.render(),
            this.timersNyukyoView.render(),
            this.timersCreateshipView.render()
        );
        return this.$el;
    };
    TimersView.prototype.update = function(){
        this.timersMissionView.update();
        this.timersNyukyoView.update();
        this.timersCreateshipView.update();
    };
})();
