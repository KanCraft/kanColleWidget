var QuestViewFactory = function(quest) {
    if (quest.state == 0) return new YetQuestView(quest);
    if (quest.state == 1) return new NowQuestView(quest);
    if (quest.state == 2) return new DoneQuestView(quest);
};

var DoneQuestView = function(doneQuest) {
    this.quest = doneQuest;
    this.tpl = '<tr><td>{{title}}</td><td>[<a class="hide-quest clickable">{{state}}</a>]</td></tr>';
    this.events = {
        "click a.hide-quest" : "remove"
    };
    this.attrs = {
        id : this.quest.id
    };
};
DoneQuestView.prototype = Object.create(widgetPages.View.prototype);
DoneQuestView.prototype.constructor = DoneQuestView;
DoneQuestView.prototype.render = function(){
    var params = {
        title : this.quest.title,
        state : "達成"
    };
    return this.apply(params)._render();
};
DoneQuestView.prototype.remove = function(ev){
    $(ev.currentTarget).remove();
};

var NowQuestView = function(nowQuest) {
    this.quest = nowQuest;
    this.tpl = '<tr><td>{{title}}</td><td>[{{state}}]</td></tr>';
    this.events = {
    };
    this.attrs = {
        id : this.quest.id,
    };
};
NowQuestView.prototype = Object.create(widgetPages.View.prototype);
NowQuestView.prototype.constructor = NowQuestView;
NowQuestView.prototype.render = function(){
    var params = {
        title : this.quest.title,
        state : "遂行中"
    };
    return this.apply(params)._render();
};

var YetQuestView = function(yetQuest) {
    this.quest = yetQuest;
    this.tpl = '<tr><td>{{title}}</td><td>[{{state}}]</td></tr>';
    this.events = {
    };
    this.attrs = {
        id : this.quest.id,
    };
};
YetQuestView.prototype = Object.create(widgetPages.View.prototype);
YetQuestView.prototype.constructor = YetQuestView;
YetQuestView.prototype.render = function(){
    var params = {
        title : this.quest.title,
        state : " "
    };
    return this.apply(params)._render();
};
