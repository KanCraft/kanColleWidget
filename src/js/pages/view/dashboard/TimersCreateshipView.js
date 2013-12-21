var widgetPages = widgetPages || {};

(function() {
    var TimersCreateshipView = widgetPages.TimersCreateshipView = function() {
        this.tpl = '<div></div>';
        this.events = {};
        this.attrs = {
            id    : 'time-list-wrapper-createships',
            class : 'time-list'
        };
        this.createships = new KanColleWidget.Createships();
    };
    TimersCreateshipView.prototype = Object.create(widgetPages.View.prototype);
    TimersCreateshipView.prototype.constructor = TimersCreateshipView;
    TimersCreateshipView.prototype.render = function(){
        this.apply()._render();
        this.renderTimers(this.createships.getAll());
        return this.$el;
    };
    TimersCreateshipView.prototype.renderTimers = function(createships){
        this.$el.find('ul').remove();
        var $ul = $('<ul></ul>').addClass('time-list-container');
        var $lis = [];
        for(var i in createships){
            var timerView = new widgetPages.TimerView(
                "createship","api_kdock_id",createships[i]
            );
            $lis.push(timerView.render("建造d"));
        }
        this.$el.append($ul.append($lis));
    };
    TimersCreateshipView.prototype.update = function(){
        this.renderTimers(this.createships.getAll());
    };
})();
