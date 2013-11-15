
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
                 + '  <div id="seconds-wrapper" style="background-image:url("{{iconUrl}}");">'
                 + '    <div id="seconds-position">'
                 + '      <span id="seconds">00</span>'
                 + '    </div>'
                 + '  </div>'
                 + '</div>';
        this.events = {};
    };
    DateIconView.prototype = Object.create(widgetPages.View.prototype);
    DateIconView.prototype.constructor = DateIconView;
    DateIconView.prototype.render = function(){
        var iconUrl = Config.get("notification-img-url") || "";
        this.apply({
          iconUrl : iconUrl
        })._render();
        return this.$el;
    };
    DateIconView.prototype.update = function(d){
        $("#month").html(Util.zP(2, d.getMonth() + 1));
        $("#date").html(Util.zP(2, d.getDate()));
        $("#seconds").html(Util.zP(2, d.getSeconds()));
    };
})();
