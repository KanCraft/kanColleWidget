var widgetPages = widgetPages || {};
(function(){
    "use strict";
    var ManualTimerCreateshipView = widgetPages.ManualTimerCreateshipView = function(params){
        console.log(params);
        this.modelName = 'createship';
        this.model = new KanColleWidget.Createships();
        this.purpose = '建造';
        this.identifier = params['api_kdock_id'];
        this.identifierName = "第" + this.identifier + "ドック";
        this.kind = 'createship-start';
    };
    ManualTimerCreateshipView.prototype = Object.create(widgetPages.ManualTimerView.prototype);
    ManualTimerCreateshipView.prototype.constructor = ManualTimerCreateshipView;
})();
