var widgetPages = widgetPages || {};

(function() {
    var QuestListView = widgetPages.QuestListView = function(quests) {
        this.lastUpdate = 0;
        this.quests = quests;
        this.tpl = '<div class="contents">'
                  +'    <h5>デイリー任務消化状況 (<span id="progress" class="xsmall"></span>)</h5>'
                  +'    <div id="quest-list-container">'
                  +'        <table id="quests" class="table"></table>'
                  +'    </div>'
                  +'</div>'
        this.events = {
            'click .hide-quest' : "hideQuest"
        };
        this.total = Object.keys(this.quests.getAll().map).length;
        this.completed = 0;
    };
    QuestListView.prototype = Object.create(widgetPages.View.prototype);
    QuestListView.prototype.constructor = QuestListView;
    QuestListView.prototype.render = function(){
        this.apply()._render();
        this.renderList();
        return this.$el;
    };
    QuestListView.prototype.renderList = function(){
        var questList = this.quests.availables();
        this.completed = 0;
        var $trs = [];
        for (var i in questList) {
            if (KanColleWidget.Quests.state.NOW < questList[i].state) this.completed++;
            var questView = widgetPages.QuestViewFactory(questList[i]);
            $trs.push(questView.render());
        }
        this.$el.find('table').html('').append($trs);
        this.$el.find('#progress').html(this.getProgress());
    };
    QuestListView.prototype.update = function(){
        this.lastUpdate = Date.now();
        return this.renderList();
    };
    QuestListView.prototype.haveUpdate = function(){
        return this.quests.haveUpdate(this.lastUpdate);
    };
    QuestListView.prototype.getProgress = function(){
        return "達成" + String(this.completed) + "/全" + String(this.total);
    };
    QuestListView.prototype.hideQuest = function(ev, self){
        var qid = $(ev.target).attr("quest-id");
        self.quests.hide(qid);
        $("tr#" + qid).hide();
    };
})();
