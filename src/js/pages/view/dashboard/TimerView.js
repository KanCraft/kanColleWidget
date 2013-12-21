var widgetPages = widgetPages || {};

(function() {
    var TimerView = widgetPages.TimerView = function(target, primaryKey,eventObj, isSelectPage) {
        this.target = target;
        this.event = eventObj;
        this.primaryKey = primaryKey;
        this.namePrefix = '第';
        this.tpl = '<li><a class="clickable"><time>{{time}}</time><name>{{name}}</name></a></li>';
        this.events = {
            //'click a' : 'openManualWindow'
        };
        this.isSelectPage = isSelectPage;
    };
    TimerView.prototype = Object.create(widgetPages.View.prototype);
    TimerView.prototype.constructor = TimerView;
    TimerView.prototype.render = function(suffix){
        var name = this.namePrefix + this.event[this.primaryKey] + suffix;
        var params = {time:'--:--&nbsp;&nbsp;&nbsp;&nbsp;', name: name};
        this.apply(params)._render();

        if (this.event.finish) this.$el.find('time').html(this.toText());

        if (this.isSelectPage) return this.$el;

        var self = this;
        this.$el.find('time').hover(
            function(ev){
                if($('.alt-time').length > 0) $('.alt-time').remove();
                self.alt = self['showAlternatives'](ev,self);
            },
            function(ev){
                self.alt = self['removeAlternatives'](ev,self);
            }
        );
        this.$el.find('a').on('click',function(ev){
            self['openManualWindow'](ev,self);
        });

        return this.$el;
    };
    TimerView.prototype.toText = function(isAlt){

        var finishtime = this.event.finish;

        var h, m;
        var optional = '';

        var showRemainedTime = Config.get('timer-format-remained-time');

        if(isAlt) showRemainedTime = ! showRemainedTime;

        if(showRemainedTime){
            var diffMilliSec = finishtime - Date.now();
            var min = 60*1000;
            var hour = 60*min;
            m = parseInt((diffMilliSec % hour)/min);
            h = parseInt((diffMilliSec - m*min)/hour);
            if (isAlt) {
                optional = 'あと ';
            }
        }else{
            var finishD = new Date(finishtime);
            h = Util.zP(2, finishD.getHours());
            m = Util.zP(2, finishD.getMinutes());

            if (isAlt) {
                optional = (1+finishD.getMonth())+'月'+finishD.getDate()+'日';
            }
        }

        return optional + Util.zP(2,h) + '<span class="twincle sec">:</span>' + Util.zP(2,m);
    };
    TimerView.prototype.openManualWindow = function(ev, self){
        var path = "src/html/set_manual_timer.html";
        var params = {};
        params[self.primaryKey] = self.event[self.primaryKey];
        params['purpose'] = self.target;
        Util.enterTimeManually(params, path);
    };
    TimerView.prototype.showAlternatives = function(ev, self){

        if (self.event.finish == null) return;

        return $('<div></div>').addClass('alt-time').css({
            left: (ev.clientX * 3) / 4,
            top: ev.clientY - 50
        }).append(self.toText(true)).hide().prependTo('body').fadeIn(80);
    };
    TimerView.prototype.removeAlternatives = function(ev, self){
        if (! self.alt) return;
        self.alt.fadeOut(80,function(){ $(this).remove() });
    };
})();
