var widgetPages = widgetPages || {};

(function() {
    "use strict";
    var QuestViewFactory = widgetPages.QuestViewFactory = function(quest) {
        if (quest.state == KanColleWidget.Quests.state.YET) return new widgetPages.YetQuestView(quest);
        if (quest.state == KanColleWidget.Quests.state.NOW) return new widgetPages.NowQuestView(quest);
        if (quest.state == KanColleWidget.Quests.state.DONE) return new widgetPages.DoneQuestView(quest);
        if (quest.state == KanColleWidget.Quests.state.HIDDEN) return new widgetPages.HiddenQuestView(quest);
    };

    // Base class for Quest Item
    var QuestView = widgetPages.QuestView = function(){};
    Util.extend(QuestView, widgetPages.View);
    QuestView.prototype.showModal = function(ev, self){
        var modalView = new widgetPages.QuestModalView(self.quest);
        modalView.render().show();
    };

    // 達成
    var DoneQuestView = widgetPages.DoneQuestView = function(doneQuest) {
        this.quest = doneQuest;
        this.tpl = '<tr id="{{id}}"><td><a class="quest-title clickable">{{title}}</a></td><td>[<a class="hide-quest clickable" quest-id="{{id}}">{{state}}</a>]</td></tr>';
        this.attrs = {
            id    : this.quest.id
        };
        this.events = {
            "click .quest-title" : "showModal"
        };
    };
    Util.extend(DoneQuestView, widgetPages.QuestView);
    DoneQuestView.prototype.render = function(){
        var params = {
            title : this.quest.title,
            state : "達成",
            id    : this.quest.id
        };
        return this.apply(params)._render().$el;
    };

    // 達成 && 非表示
    var HiddenQuestView = widgetPages.HiddenQuestView = function(hiddenQuest) {
        this.quest = hiddenQuest;
        this.tpl = '';
    };
    Util.extend(HiddenQuestView, widgetPages.QuestView);
    HiddenQuestView.prototype.render = function(){
        return this.apply()._render().$el;
    };

    // 遂行中
    var NowQuestView = widgetPages.NowQuestView = function(nowQuest) {
        this.quest = nowQuest;
        this.tpl = '<tr><td><a class="quest-title clickable">{{title}}</a></td><td>[{{state}}]</td></tr>';
        this.attrs = {
            id    : this.quest.id
        };
        this.events = {
            "click .quest-title" : "showModal"
        };
    };
    Util.extend(NowQuestView, widgetPages.QuestView);
    NowQuestView.prototype.render = function(){
        var params = {
            title : this.quest.title,
            state : "遂行中"
        };
        return this.apply(params)._render().$el;
    };

    var YetQuestView = widgetPages.YetQuestView = function(yetQuest) {
        this.quest = yetQuest;
        this.tpl = '<tr><td><a class="quest-title clickable">{{title}}</a></td><td>[{{state}}]</td></tr>';
        this.attrs = {
            id : this.quest.id
        };
        this.events = {
            "click .quest-title" : "showModal"
        };
    };
    Util.extend(YetQuestView, widgetPages.QuestView);
    YetQuestView.prototype.render = function(){
        var params = {
            title : this.quest.title,
            state : " "
        };
        return this.apply(params)._render().$el;
    };
})();
