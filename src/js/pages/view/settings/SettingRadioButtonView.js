/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var SettingRadioButtonView = widgetPages.SettingRadioButtonView = function(){};
    SettingRadioButtonView.prototype = Object.create(widgetPages.View.prototype);
    SettingRadioButtonView.prototype.constructor = SettingRadioButtonView;

    SettingRadioButtonView.prototype.tpl = '<tr>'
                                         + '    <td class="title">{{title}}<span class="description xsmall">{{description}}</span></td>'
                                         + '    <td class="radio-container"></td>'
                                         + '</tr>';

    SettingRadioButtonView.prototype.listen = function(config) {
        this.config = config || Config;
        var eventKey = 'change .' + this.inputName;
        this.events = this.events || {};
        this.events[eventKey] = "_listenRadioChange";
        return this;
    };

    SettingRadioButtonView.prototype._listenRadioChange = function(ev, self){
        var val = $(ev.target).val();
        return self.config.set(self.inputName, val);
    };

    SettingRadioButtonView.prototype.renderInputs = function(){
        var nowSelectedValue = this.config.get(this.inputName);
        var $_container = $('<div>');
        for (var i in this.elements) {
            var el = this.elements[i];
            var $input = $('<input type="radio"></input>')
            $input.attr({
                'class' : this.inputName,
                'name'  : this.inputName,
                'value' : el.value
            });
            if (i != 0) $_container.append($('<br>'));
            if (el.value == nowSelectedValue) $input.attr({checked:true});
            $_container.append($input);
            $_container.append($('<span></span>').text(el.title || el.value));
        }
        this.$el.find('.radio-container').append($_container);
        return this;
    };

    SettingRadioButtonView.prototype.render = function(){
        this.apply({
            title : this.title,
            description : this.description || ''
        }).listen()._render();
        this.renderInputs();
        return this.$el;
    };
})();
