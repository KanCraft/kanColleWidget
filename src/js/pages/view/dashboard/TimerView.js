var widgetPages = widgetPages || {};

(function() {
    var TimerView = widgetPages.TimerView = function(target, primaryId,eventObj) {
        this.target = target;
        this.event = eventObj;
        this.primaryId = primaryId;
        this.namePrefix = '第';
        this.tpl = '<li><a class="clickable"><time>{{time}}</time><name>{{name}}</name></a></li>';
        this.events = {
            'click a' : 'openManualWindow'
        };
        this.attrs = {
        };
    };
    TimerView.prototype = Object.create(widgetPages.View.prototype);
    TimerView.prototype.constructor = TimerView;
    TimerView.prototype.render = function(suffix){
        var name = this.namePrefix + this.event[this.primaryId] + suffix;
        var params = {time:'--:--&nbsp;&nbsp;&nbsp;&nbsp;', name: name};
        if (this.event.finish) {
            params.time = this.toText(this.event.finish);
        }
        this.apply(params)._render();
        return this.$el;
    };
    TimerView.prototype.toText = function(finishtime){

        var h,m;

        if(true){
            var diffMilliSec = finishtime - Date.now();
            var min = 60*1000;
            var hour = 60*min;
            m = parseInt((diffMilliSec % hour)/min);
            h = parseInt((diffMilliSec - m*min)/hour);
        }else{
            var finishD = new Date(finishtime);
            h = Util.zP(2, finishD.getHours());
            m = Util.zP(2, finishD.getMinutes());
        }

        return Util.zP(2,h) + ':' + Util.zP(2,m);
    };
    TimerView.prototype.openManualWindow = function(ev, self){
        var path = "src/html/set_manual_timer.html";
        var params = {};
        params[self.primaryId] = self.event[self.primaryId];
        console.log(self);
        params['purpose'] = self.target;
        Util.enterTimeManually(params, path);
    };
})();
