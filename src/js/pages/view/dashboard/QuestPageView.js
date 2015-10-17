var widgetPages = widgetPages || {};

(function() {
    var QuestPageView = widgetPages.QuestPageView = function(quests) {
        this.tpl = '<div class="contents boxy">'
                  +'</div>';
        this.questlist = new widgetPages.QuestListView(new KanColleWidget.Quests());
        this.achievements = new widgetPages.AchievementsView(new KanColleWidget.Achievements(new MyStorage()));
    };
    Util.extend(QuestPageView, widgetPages.View);
    QuestPageView.prototype.render = function(){
        this.apply()._render();
        this.$el.append(
          this.questlist.render(),
          this.achievements.render()
        );
        return this.$el;
    };
})();
