var widgetPages = widgetPages || {};
(function() {
    var TimersBaseView = widgetPages.TimersBaseView = function(){};
    TimersBaseView.prototype = Object.create(widgetPages.View.prototype);
    TimersBaseView.prototype.constructor = TimersBaseView;
    TimersBaseView.prototype.render = function(){
        this.tpl = '<div class="time-list"></div>';
        this.apply()._render();
        this.$el.append(
            this.renderTitle(),
            this.renderTimers()
        );
        return this.$el;
    };
    TimersBaseView.prototype.renderTitle = function(){
        if (Config.get('clockmode-style') == 1) return '';
        return '<p class="list-title">' + this.title + '</p>';
    };
    TimersBaseView.prototype.renderTimers = function(){
        var eventsObj = this.eventsModel.getAll();
        this.$el.find('ul').remove();
        var $ul = $('<ul></ul>').addClass('time-list-container');
        var $lis = [];
        if (this.purpose == 'mission') {
            $lis.push('<li><time>--:--&nbsp;&nbsp;&nbsp;&nbsp;</time><name>第1艦隊</name></li>');//遠征の場合のみ、第一艦隊は固定
        }
        for(var i in eventsObj){
            var timerView = new widgetPages.TimerView(
                this.purpose,
                this.primaryKey,
                eventsObj[i]
            );
            $lis.push(timerView.render(this.nameSuffix));
        }
        return $ul.append($lis);
    };
    TimersBaseView.prototype.update = function(){
        this.$el.html('').append(
            this.renderTitle(),
            this.renderTimers()
        );
    };
})();
