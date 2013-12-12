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
    QuestView.prototype = Object.create(widgetPages.View.prototype);
    QuestView.prototype.constructor = QuestView;
    QuestView.prototype.showModal = function(ev, self){
        var modalContents = new widgetPages.QuestModalContentsView(self.quest);
        var modalView = new widgetPages.ModalView(modalContents.render());
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
    DoneQuestView.prototype = Object.create(widgetPages.QuestView.prototype);
    DoneQuestView.prototype.constructor = DoneQuestView;
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
    HiddenQuestView.prototype = Object.create(widgetPages.QuestView.prototype);
    HiddenQuestView.prototype.constructor = HiddenQuestView;
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
    NowQuestView.prototype = Object.create(widgetPages.QuestView.prototype);
    NowQuestView.prototype.constructor = NowQuestView;
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
    YetQuestView.prototype = Object.create(widgetPages.QuestView.prototype);
    YetQuestView.prototype.constructor = YetQuestView;
    YetQuestView.prototype.render = function(){
        var params = {
            title : this.quest.title,
            state : " "
        };
        return this.apply(params)._render().$el;
    };
})();
