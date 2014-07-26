var widgetPages = widgetPages || {};
(function() {
    var DateIconView = widgetPages.DateIconView = function() {
        this.tpl = '<div id="clock-left">'
                 + '  <div id="date-wrapper">'
                 + '    <span id="month">09</span>'
                 + '    <span id="char-month">月</span>'
                 + '    <span id="date">09</span>'
                 + '    <span id="char-date">日</span>'
                 + '  </div>'
                 + '  <div id="seconds-wrapper" style="background-image:url("{{iconUrl}}");" class="clickable">'
                 + '    <div id="seconds-position">'
                 + '      <span id="seconds">00</span>'
                 + '    </div>'
                 + '  </div>'
                 + '</div>';
        this.events = {};
    };
    Util.extend(DateIconView, widgetPages.View);
    DateIconView.prototype.render = function(){
        var iconUrl = Config.get("notification-img-file") || "";
        this.apply()._render();
        this.$el.find("#seconds-wrapper").css({backgroundImage:'url("' + iconUrl + '")'});
        this.$el.find("#seconds-wrapper").on("click",function(){
            chrome.runtime.sendMessage(null, {purpose:'launch'});
        });
        return this.$el;
    };
    DateIconView.prototype.update = function(d){
        $("#month").html(Util.zP(2, d.getMonth() + 1));
        $("#date").html(Util.zP(2, d.getDate()));
        $("#seconds").html(Util.zP(2, d.getSeconds()));
    };
})();
