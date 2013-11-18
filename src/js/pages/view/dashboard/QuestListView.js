var widgetPages = widgetPages || {};

(function() {
    var QuestListView = widgetPages.QuestListView = function(quests) {
        this.lastUpdate = 0;
        this.quests = quests;
        this.tpl = '<table></table>';
        this.events = {
            'click .hide-quest' : "hideQuest"
        };
        this.attrs = {
            id : "quests",
            class : "table"
        };
        this.total = Object.keys(this.quests.getAll().map).length;
        this.completed = 0;
    };
    QuestListView.prototype = Object.create(widgetPages.View.prototype);
    QuestListView.prototype.constructor = QuestListView;
    QuestListView.prototype.render = function(){
        // var questList = this.quests.getAll().map;
        var questList = this.quests.availables();
        this.apply()._render();
        this.completed = 0;//init
        for (var i in questList) {
            if (Quests.state.NOW < questList[i].state) this.completed++;
            var questView = widgetPages.QuestViewFactory(questList[i]);
            this.$el.append(questView.render());
        }
        return this.$el;
    };
    QuestListView.prototype.refresh = function(){
        this.lastUpdate = Date.now();
        return this.render();
    };
    QuestListView.prototype.haveUpdate = function(){
        return this.quests.haveUpdate(this.lastUpdate);
    };
    QuestListView.prototype.getProgress = function(){
        return "達成" + String(this.completed) + "/全" + String(this.total);
    };
    QuestListView.prototype.hideQuest = function(ev, self){
        self.quests.hide($(ev.target).attr("quest-id"));
    };
})();
