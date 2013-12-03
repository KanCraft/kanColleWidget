var widgetPages = widgetPages || {};
(function(){
    "use strict";
    var params = Util.parseQueryString();
    var GenView = function(params){
        switch(params.purpose){
            case 'mission':
                return new widgetPages.ManualTimerMissionView(params);
            case 'createship':
                return new widgetPages.ManualTimerCreateshipView(params);
            case 'nyukyo':
                return new widgetPages.ManualTimerNyukyoView(params);
        }
    };
    var view = GenView(params);
    $('body').append(view.render());
})();
