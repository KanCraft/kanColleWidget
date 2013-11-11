var QuestListView = function(questList) {
    this.questList = questList;
    this.tpl = '<table></table>';
    this.events = {};
    this.attrs = {
        id : "quests",
        class : "table"
    };
};
QuestListView.prototype = Object.create(widgetPages.View.prototype);
QuestListView.prototype.constructor = QuestListView;
QuestListView.prototype.render = function(questList){
    this.questList = questList || this.questList;
    this.apply()._render();
    for (var i in this.questList) {
        var questView = QuestViewFactory(this.questList[i]);
        this.$el.append(questView.render());
    }
    return this.$el;
};
