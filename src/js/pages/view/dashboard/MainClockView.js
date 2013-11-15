var widgetPages = widgetPages || {};

(function() {
    var MainClockView = widgetPages.MainClockView = function() {
        this.tpl = '<div></div>';
        this.events = {};
        this.attrs = {
            class : 'boxy'
        };
        this.dateIconView = new widgetPages.DateIconView();
        this.daysTimeView = new widgetPages.DaysTimeView();
    };
    MainClockView.prototype = Object.create(widgetPages.View.prototype);
    MainClockView.prototype.constructor = MainClockView;
    MainClockView.prototype.render = function(){
        this.apply()._render();
        this.renderLeft();
        this.renderRight();
        return this.$el;
    };
    MainClockView.prototype.renderLeft = function(){
        this.$el.append(this.dateIconView.render());
        return this;
    };
    MainClockView.prototype.renderRight = function(){
        this.$el.append(this.daysTimeView.render());
        return this;
    };
    MainClockView.prototype.ticktack = function(){
        var date = new Date();
        this.dateIconView.update(date);
        if (date.getSeconds() == 0) {
            this.daysTimeView.update(date);
        }
    };
})();
