var widgetPages = widgetPages || {};
(function() {
    "use strict";
    var MissionInfoView = widgetPages.MissionInfoView = function(){
        this.tpl = '<div>'
                 + '  <h5>'
                 + '    遠征早見表'
                 + '    <span id="open-mission-info" class="clickable">開く</span>'
                 + '  </h5>'
                 + '</div>';
    };
    Util.extend(MissionInfoView, widgetPages.View);
    MissionInfoView.prototype.render = function() {
        this.apply()._render();
        this.$el.find('#open-mission-info').on('click',function(ev){
            window.open('mission-info.html',null,"width=940,height=800");
        });
        return this.$el;
    };
    MissionInfoView.prototype.reconstructTable = function($table) {
        return $table;
    };
})();
