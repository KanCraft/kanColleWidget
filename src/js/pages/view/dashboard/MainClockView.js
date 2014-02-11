var widgetPages = widgetPages || {};

(function() {
    var MainClockView = widgetPages.MainClockView = function() {
        this.tpl = '<div id="main-clock" class="contents boxy">'
                  +'  <div class="boxy"></div>'
                  +'</div>';
        this.dateIconView = new widgetPages.DateIconView();
        this.daysTimeView = new widgetPages.DaysTimeView();
    };
    Util.extend(MainClockView, widgetPages.View);
    MainClockView.prototype.render = function(){
        this.apply()._render();
        this.$el.find('.boxy').append(
            this.renderLeft(),
            this.renderRight()
        );
        this.update(true);
        return this.$el;
    };
    MainClockView.prototype.renderLeft = function(){
        return this.dateIconView.render();
    };
    MainClockView.prototype.renderRight = function(){
        return this.daysTimeView.render();
    };
    MainClockView.prototype.update = function(force){
        var date = new Date();
        this.dateIconView.update(date);
        if (force || date.getSeconds() == 0) {
            this.daysTimeView.update(date);
        }
    };
})();
