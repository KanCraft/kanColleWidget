/***** class definitions *****/
function QuestAction(){/*** 任務系のAPIが叩かれたときのアクション ***/
    this.quests = new Quests();
}

QuestAction.prototype.forStart = function(params){
    this.quests.embark(params['api_quest_id'][0]);
}
QuestAction.prototype.forClear = function(params){
    this.quests.done(params['api_quest_id'][0]);
}
