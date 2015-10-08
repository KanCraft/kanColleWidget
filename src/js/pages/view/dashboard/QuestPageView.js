var widgetPages = widgetPages || {};

(function() {
    var QuestPageView = widgetPages.QuestPageView = function(quests) {
        this.tpl = '<div class="contents boxy">'
                  +'  <div id="quests-list"></div>'
                  +'  <div id="achievements-list"></div>'
                  +'</div>';
        this.questlist = new widgetPages.QuestListView(new KanColleWidget.Quests());
    };
    Util.extend(QuestPageView, widgetPages.View);
    QuestPageView.prototype.render = function(){
        this.apply()._render();
        this.$el.find('#quests-list').append(
          this.questlist.render()
        );
        return this.$el;
    };
})();
