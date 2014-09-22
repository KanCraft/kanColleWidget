/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var EnablePushRemindView = widgetPages.EnablePushRemindView = function(){
        this.inputName = 'enable-push-remind';
        this.title = "タイマーのPush通知";
        this.description = 'iOSのPush通知連携です。'
        + 'Twitterアカウントで管理するので、上の「Twitter連携」にもチェックを入れないと有効になりません。';
        this._list = [
            {id:'enable-push-remind-mission',text:'遠征'},
            {id:'enable-push-remind-nyukyo',text:'入渠'},
            {id:'enable-push-remind-createship',text:'建造'},
            {id:'enable-push-remind-sortie',text:'疲労度'},
            {id:'enable-push-remind-confirm',text:'その都確認する'}
        ];
    };
    EnablePushRemindView.prototype.tpl = ''
        + '<tr>'
        + '    <td class="title">{{title}}</td>'
        + '    <td class="checkbox-container"></td>'
        + '</tr>';
    EnablePushRemindView.prototype.renderInputs = function() {
        var checkboxTpl = '<label class="clickable"><input type="checkbox" id="{{id}}"/>{{text}}</label>';
        var $_container = $('<div class="multi-checkbox"></div>');
        $.map(this._list, function(setting) {
            var $el = $(checkboxTpl.replace('{{id}}', setting.id).replace('{{text}}',setting.text));
            $_container.append($el);
        });
        this.$el.find('.checkbox-container').append($_container);
    };
    EnablePushRemindView.prototype.render = function() {
        this.$el = $(this.tpl.replace('{{title}}', this.title));
        this.renderInputs();
        this.$el.find('td').last().append($('<span class="xsmall"></span>').append(this.description));
        this.bindEvents();
        this.affectExistingSettings();
        return this.$el;
    };
    EnablePushRemindView.prototype.bindEvents = function() {
        var self = this;
        $('.multi-checkbox>label>input', this.$el).on('change',function(ev){
            // confirmのときだけ挙動は特殊
            if (ev.currentTarget.id.match('confirm')) {
                if (ev.currentTarget.checked) {
                    self.disableAll(ev);
                    Config.set('enable-push-remind-confirm', true);
                } else {
                    self.enableAll(ev);
                    Config.set('enable-push-remind-confirm', false);
                }
                return;
            }
            var key = ev.currentTarget.id;
            var val = ev.currentTarget.checked;
            Config.set(key, val);
        });
    };
    EnablePushRemindView.prototype.disableAll = function(ev) {
        this.$el.find('input').attr('disabled',true);
        this.$el.find('label').css({opacity:"0.3"});
        $('#enable-push-remind-confirm', this.$el)[0].removeAttribute('disabled');
        $('#enable-push-remind-confirm', this.$el)[0].parentNode.style.opacity = "1";
    };
    EnablePushRemindView.prototype.enableAll = function(ev) {
        this.$el.find('input').attr('disabled', false);
        this.$el.find('label').css({opacity:"1"});
    };
    EnablePushRemindView.prototype.affectExistingSettings = function() {
        var self = this;
        $.map(this._list, function(setting){
            var key = setting.id;
            if (Config.get(key)) self.$el.find('#' + key).attr('checked',true);
            if (key.match('confirm') && Config.get(key)) self.disableAll();
        });
    };
})();
