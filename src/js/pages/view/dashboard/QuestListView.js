var widgetPages = widgetPages || {};

(function() {
    var QuestListView = widgetPages.QuestListView = function(questList) {
        this.questList = questList;
        this.tpl = '<table></table>';
        this.events = {};
        this.attrs = {
            id : "quests",
            class : "table"
        };
        this.progress = 0;
    };
    QuestListView.prototype = Object.create(widgetPages.View.prototype);
    QuestListView.prototype.constructor = QuestListView;
    QuestListView.prototype.render = function(questList){
        this.questList = questList || this.questList;
        this.apply()._render();
        var cntDone = 0;
        for (var i in this.questList) {
            if (this.questList[i].state == 2) cntDone++;
            var questView = widgetPages.QuestViewFactory(this.questList[i]);
            this.$el.append(questView.render());
        }
        this.progress = Math.floor(cntDone*100/Object.keys(this.questList).length);
        return this.$el;
    };
})();
