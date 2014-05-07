var widgetPages = widgetPages || {};
(function() {
    "use strict";
    var QuestModalView = widgetPages.QuestModalView = function(quest){
        this.$inner = (new widgetPages.QuestModalContentsView(quest)).render();
    };
    Util.extend(QuestModalView, widgetPages.ModalView);

    var QuestModalContentsView = widgetPages.QuestModalContentsView = function(quest) {
        this.quest = quest;
        this.tpl = '<div>'
                 + '    <div class="modal-header-in-dashboard"><h1>{{title}}</h1></div>'
                 + '    <div class="modal-middle">'
                 + '        <h1>現状 : {{status}}</h1>'
                 + '    </div>'
                 + '    <div class="modal-footer">'
                 + '        <span>'
                 + '            <a id="modal-done" class="clickable">&gt; [達成しました！]</a>'
                 + '            <a id="modal-cancel" class="clickable">&gt; [戻ります！]</a>'
                 + '        </span>'
                 + '    </div>'
                 + '</div>';
        this.attrs = {
            class : "modal-contents"
        };
        this.events = {
            //'click #modal-done'   : 'doneQuest',
            'click #modal-cancel' : 'vanish'
        };
    };
    Util.extend(QuestModalContentsView, widgetPages.View);
    QuestModalContentsView.prototype.render = function(){
        var params = {
            title  : this.quest.title,
            status : this._getStatusString()
        };
        this.apply(params)._render();
        // {{{ Fuck
        var self =this;
        this.$el.find('#modal-done').on('click',function(ev){
            self.doneQuest(ev, self);
        });
        // }}}
        return this.$el;
    };
    QuestModalContentsView.prototype._getStatusString = function(){
        switch (this.quest.state) {
            case 0:
                return "未着手";
            case 1:
                return "遂行中";
            case 2:
                return "達成";
            case 3:
                return "片付け";
        }
    };
    QuestModalContentsView.prototype.doneQuest = function(){
        var questAccessor = new KanColleWidget.Quests();// これもファックな設計だなー
        questAccessor.done(this.quest.id);
        this.vanish();
    };
    QuestModalContentsView.prototype.vanish = function(){
        this.$el.fadeOut(100, function(){
            $('#modal-wrapper').remove();
        });
    };
})();
