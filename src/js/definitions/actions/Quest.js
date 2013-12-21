var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var QuestAction = KanColleWidget.QuestAction = function(){
        this.quests = new KanColleWidget.Quests();
    };
    QuestAction.prototype.forStart = function(params){
        this.quests.embark(params['api_quest_id'][0]);
    };
    QuestAction.prototype.forClear = function(params){
        this.quests.done(params['api_quest_id'][0]);
    };
    QuestAction.prototype.forStop = function(params){
        this.quests.cancel(params['api_quest_id'][0]);
    };
})();
