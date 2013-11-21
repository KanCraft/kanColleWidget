var widgetPages = widgetPages || {};

(function() {
    var QuestViewFactory = widgetPages.QuestViewFactory = function(quest) {
        if (quest.state == Quests.state.YET) return new widgetPages.YetQuestView(quest);
        if (quest.state == Quests.state.NOW) return new widgetPages.NowQuestView(quest);
        if (quest.state == Quests.state.DONE) return new widgetPages.DoneQuestView(quest);
        if (quest.state == Quests.state.HIDDEN) return new widgetPages.HiddenQuestView(quest);
    };

    // 達成
    var DoneQuestView = widgetPages.DoneQuestView = function(doneQuest) {
        this.quest = doneQuest;
        this.tpl = '<tr><td>{{title}}</td><td>[<a class="hide-quest clickable" quest-id="{{id}}">{{state}}</a>]</td></tr>';
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
            state : "達成",
            id    : this.quest.id
        };
        return this.apply(params)._render().$el;
    };
    DoneQuestView.prototype.remove = function(ev){
        $(ev.currentTarget).remove();
    };

    // 達成 && 非表示
    var HiddenQuestView = widgetPages.HiddenQuestView = function(hiddenQuest) {
        this.quest = hiddenQuest;
        this.tpl = '';
    };
    HiddenQuestView.prototype = Object.create(widgetPages.View.prototype);
    HiddenQuestView.prototype.constructor = HiddenQuestView;
    HiddenQuestView.prototype.render = function(){
        return this.apply()._render().$el;
    };

    // 遂行中
    var NowQuestView = widgetPages.NowQuestView = function(nowQuest) {
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
        return this.apply(params)._render().$el;
    };

    var YetQuestView = widgetPages.YetQuestView = function(yetQuest) {
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
        return this.apply(params)._render().$el;
    };
})();
