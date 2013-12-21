var widgetPages = widgetPages || {};

(function() {
    var TimersMissionView = widgetPages.TimersMissionView = function() {
        this.tpl = '<div></div>';
        this.events = {};
        this.attrs = {
            id    : 'time-list-wrapper-missions',
            class : 'time-list'
        };
        this.missions = new KanColleWidget.Missions();
    };
    TimersMissionView.prototype = Object.create(widgetPages.View.prototype);
    TimersMissionView.prototype.constructor = TimersMissionView;
    TimersMissionView.prototype.render = function(){
        this.apply()._render();
        this.renderTimers(this.missions.getAll());
        return this.$el;
    };
    TimersMissionView.prototype.renderTimers = function(missions){
        this.$el.find('ul').remove();
        var $ul = $('<ul></ul>').addClass('time-list-container');
        var $lis = ['<li><time>--:--&nbsp;&nbsp;&nbsp;&nbsp;</time><name>第1艦隊</name></li>'];//遠征の場合のみ、第一艦隊は固定
        for(var i in missions){
            var timerView = new widgetPages.TimerView(
                "mission","deck_id",missions[i]
            );
            $lis.push(timerView.render("艦隊"));
        }
        this.$el.append($ul.append($lis));
    };
    TimersMissionView.prototype.update = function(){
        this.renderTimers(this.missions.getAll());
    };
})();
