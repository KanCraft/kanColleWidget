var widgetPages = widgetPages || {};

(function() {
    var DaysTimeView = widgetPages.DaysTimeView = function() {
        this.tpl = '<div id="clock-right">'
                 + '  <div id="day-wrapper">'
                 + '      <span class="days" id="day0">日</span>'
                 + '      <span class="days" id="day1">月</span>'
                 + '      <span class="days" id="day2">火</span>'
                 + '      <span class="days" id="day3">水</span>'
                 + '      <span class="days" id="day4">木</span>'
                 + '      <span class="days" id="day5">金</span>'
                 + '      <span class="days" id="day6">土</span>'
                 + '  </div>'
                 + '  <div id="main-clock-wrapper">'
                 + '      <span id="hour">19</span>'
                 + '      <span id="colon">:</span>'
                 + '      <span id="minute">30</span>'
                 + '  </div>'
                 + '</div>';
    };
    DaysTimeView.prototype = Object.create(widgetPages.View.prototype);
    DaysTimeView.prototype.constructor = DaysTimeView;
    DaysTimeView.prototype.render = function(){
        this.apply()._render();
        return this.$el;
    };
    DaysTimeView.prototype.update = function(d){
        var day    = d.getDay();
        this.$el.find("#hour").html(Util.zP(2, d.getHours()));
        this.$el.find("#minute").html(Util.zP(2, d.getMinutes()));
        if(parseInt(d.getHours()) == 0 || parseInt(d.getMinutes()) == 0){
            $('.days').css({fontWeight:'normal'});
        }
        $('#day' + day).css({fontWeight:'bold'});
    };
})();
