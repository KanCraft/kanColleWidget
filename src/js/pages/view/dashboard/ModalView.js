var widgetPages = widgetPages || {};

(function() {
    "use strict";
    var ModalView = widgetPages.ModalView = function($inner) {
        this.tpl = '<div></div>';
        this.$inner = $inner;
        this.events = {
        };
        this.attrs = {
            id : "dashboard-modal",
            class : "modal"
        };
    };
    ModalView.prototype = Object.create(widgetPages.View.prototype);
    ModalView.prototype.constructor = ModalView;
    ModalView.prototype.render = function(){
        this.apply()._render();
        // hidden in default
        this.$el.append(this.$inner);
        this.$el.css({display:'none'});
        return this;
    };
    ModalView.prototype.show = function(){
        this.$el.hide().appendTo('body').fadeIn(100);
    };
    /*
    ModalView.prototype.vanish = function(){
        this.$el.fadeOut(100, function(){
            $('#dashboard-modal').remove();
        });
    };
    */

    var QuestModalContentsView = widgetPages.QuestModalContentsView = function(quest) {
        this.quest = quest;
        this.tpl = '<div>'
                 + '    <div class="modal-header"><h1>{{title}}</h1></div>'
                 + '    <div class="modal-middle">'
                 + '        <h1>現状 : {{status}}</h1>'
                 + '    </div>'
                 + '    <div class="modal-footer">'
                 + '            <h2><a id="modal-done" class="clickable">&gt; [達成しました！]</a></h2>'
                 + '            <h2><a id="modal-cancel" class="clickable">&gt; [戻ります！]</a></h2>'
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
    QuestModalContentsView.prototype = Object.create(widgetPages.View.prototype);
    QuestModalContentsView.prototype.constructor = QuestModalContentsView;
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
        var questAccessor = new Quests();// これもファックな設計だなー
        questAccessor.done(this.quest.id);
        this.vanish();
    };
    QuestModalContentsView.prototype.vanish = function(){
        this.$el.fadeOut(100, function(){
            $('#dashboard-modal').remove();
        });
    };
})();
