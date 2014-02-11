var widgetPages = widgetPages || {};
(function() {
    var TimersBaseView = widgetPages.TimersBaseView = function(){};
    Util.extend(TimersBaseView, widgetPages.View);
    TimersBaseView.prototype.render = function(){
        this.tpl = '<div class="time-list"></div>';
        this.isEmpty = false;
        this.apply()._render();
        this.$el.append(
            this.renderTitle(),
            this.renderTimers()
        );
        if (this.isEmpty) this.$el.find('.list-title').remove();
        return this.$el;
    };
    TimersBaseView.prototype.renderTitle = function(){
        if (this.isSelectPage ||
            Config.get('clockmode-style') == 0) {
            return '<p class="list-title">' + this.title + '</p>';
        }
        return '';
    };
    TimersBaseView.prototype.renderTimers = function(){
        var eventsObj = this.eventsModel.getAll();
        this.$el.find('ul').remove();
        var $ul = $('<ul></ul>').addClass('time-list-container');
        var $lis = [];
        if (this.purpose == 'mission' && ! this.isSelectPage) {
            $lis.push('<li><time>--:--&nbsp;&nbsp;&nbsp;&nbsp;</time><name>第1艦隊</name></li>');//遠征の場合のみ、第一艦隊は固定
        }
        for(var i in eventsObj){
            if (this.isSelectPage && eventsObj[i].finish == null) continue;
            var timerView = new widgetPages.TimerView(
                this.purpose,
                this.primaryKey,
                eventsObj[i],
                this.isSelectPage
            );
            $lis.push(timerView.render(this.nameSuffix));
        }

        if (this.isSelectPage && $lis.length == 0) this.isEmpty = true;

        return $ul.append($lis);
    };
    TimersBaseView.prototype.update = function(){
        this.$el.html('').append(
            this.renderTitle(),
            this.renderTimers()
        );
    };
})();
