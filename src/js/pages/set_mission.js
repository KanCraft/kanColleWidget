var widgetPages = widgetPages || {};
(function(){
    "use strict";
    var params = Util.parseQueryString();
    var view = new widgetPages.ManualTimerMissionView(params);
    $('body').append(view.render());
})();
