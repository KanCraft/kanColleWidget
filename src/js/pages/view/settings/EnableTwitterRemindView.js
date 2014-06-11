/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var EnableTwitterRemindView = widgetPages.EnableTwitterRemindView = function(){
        this.inputName = 'enable-twitter-remind';
        this.title = "タイマーのTwitter通知";
        this.description = 'Twitterで'
        + '<a href="https://twitter.com/KanColleWidget" target="_blank">botちゃん</a>'
        + 'がメンションで通知してくれるようになります。'
        + '（注意！上の「Twitter連携」にもチェックを入れないと有効になりません）'
        + '<br>botちゃんズのアカウント凍結防止のため、これを利用される方は以下のことにご協力ください'
        + '<ol style="margin:0">'
        + '<li> 通知文言をなるべく独自で設定した方がいいかも</li>'
        + '<li> botちゃんのアイコンなるべく描いてくれた方がいいかも</li>'
        + '<li> botちゃんをなるべくフォローした方がいいかも</li>'
        + '</ol>';
 
        this._list = [
            {id:'enable-twitter-remind-mission',text:'遠征'},
            {id:'enable-twitter-remind-nyukyo',text:'入渠'},
            {id:'enable-twitter-remind-createship',text:'建造'},
            {id:'enable-twitter-remind-sortie',text:'疲労度'},
            {id:'enable-twitter-remind-confirm',text:'その都確認する'}
        ];
    };
    EnableTwitterRemindView.prototype.tpl = ''
        + '<tr>'
        + '    <td class="title">{{title}}</td>'
        + '    <td class="checkbox-container"></td>'
        + '</tr>';
    EnableTwitterRemindView.prototype.renderInputs = function() {
        var checkboxTpl = '<label class="clickable"><input type="checkbox" id="{{id}}"/>{{text}}</label>';
        var $_container = $('<div class="multi-checkbox"></div>');
        $.map(this._list, function(setting) {
            var $el = $(checkboxTpl.replace('{{id}}', setting.id).replace('{{text}}',setting.text));
            $_container.append($el);
        });
        this.$el.find('.checkbox-container').append($_container);
    };
    EnableTwitterRemindView.prototype.render = function() {
        this.$el = $(this.tpl.replace('{{title}}', this.title));
        this.renderInputs();
        this.$el.find('td').last().append($('<span class="xsmall"></span>').append(this.description));
        this.bindEvents();
        this.affectExistingSettings();
        return this.$el;
    };
    EnableTwitterRemindView.prototype.bindEvents = function() {
        var self = this;
        $('.multi-checkbox>label>input', this.$el).on('change',function(ev){
            // confirmのときだけ挙動は特殊
            if (ev.currentTarget.id.match('confirm')) {
                if (ev.currentTarget.checked) {
                    self.disableAll(ev);
                    Config.set('enable-twitter-remind-confirm', true);
                } else {
                    self.enableAll(ev);
                    Config.set('enable-twitter-remind-confirm', false);
                }
                return;
            }
            var key = ev.currentTarget.id;
            var val = ev.currentTarget.checked;
            Config.set(key, val);
        });
    };
    EnableTwitterRemindView.prototype.disableAll = function(ev) {
        this.$el.find('input').attr('disabled',true);
        this.$el.find('label').css({opacity:"0.3"});
        $('#enable-twitter-remind-confirm', this.$el)[0].removeAttribute('disabled');
        $('#enable-twitter-remind-confirm', this.$el)[0].parentNode.style.opacity = "1";
    };
    EnableTwitterRemindView.prototype.enableAll = function(ev) {
        this.$el.find('input').attr('disabled', false);
        this.$el.find('label').css({opacity:"1"});
    };
    EnableTwitterRemindView.prototype.affectExistingSettings = function() {
        var self = this;
        $.map(this._list, function(setting){
            var key = setting.id;
            if (Config.get(key)) self.$el.find('#' + key).attr('checked',true);
            if (key.match('confirm') && Config.get(key)) self.disableAll();
        });
    };
})();
