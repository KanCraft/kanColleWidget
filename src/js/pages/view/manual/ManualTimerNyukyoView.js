var widgetPages = widgetPages || {};
(function(){
    var ManualTimerNyukyoView = widgetPages.ManualTimerNyukyoView = function(params){
        this.modelName = 'nyukyo';
        this.model = new KanColleWidget.Nyukyos();
        this.purpose = '入渠';
        this.identifier = params['api_ndock_id'];
        this.identifierName = "第" + this.identifier + "ドック";
        this.kind = 'nyukyo-start';

        this.actionName = 'forNyukyoStart';
    };
    Util.extend(ManualTimerNyukyoView, widgetPages.ManualTimerView);
})();
