/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var SettingTextView = widgetPages.SettingTextView = function(){};
    Util.extend(SettingTextView, widgetPages.View);

    SettingTextView.prototype.tpl = '<tr>'
                                      + '    <td class="title">{{title}}</td>'
                                      + '    <td class="textinput-container"></td>'
                                      + '</tr>';

    SettingTextView.prototype.listen = function(config) {
        this.config = config || Config;
        var eventKey = 'keyup .' + this.inputName;
        this.events = this.events || {};
        this.events[eventKey] = "_listenCheckboxChanged";
        return this;
    };
    SettingTextView.prototype._listenCheckboxChanged = function(ev, self){
        var val = $(ev.target).val();
        if (self.validate && self.validate(val) !== true) {
            return self.$el.find('.validation-message').text(self.validate(val));
        }
        self.$el.find('.validation-message').html('');
        self.config.set(this.inputName, val);
    };
    SettingTextView.prototype.renderInputs = function(){
        var $_container = $('<div>');
        var $input = $('<input type="text"></input>');
        $input.attr({
            'id'         : this.inputName,
            'class'      : this.inputName,
            'name'       : this.inputName,
            'value'      : this.config.get(this.inputName),
            'placeholder': this.placeholder
        });

        $_container.append($input);
        this.$el.find('.textinput-container').append($_container);
        if (this.description) $_container.append(
            $('<span></span>').html(this.description).addClass('xsmall description'),
            $('<br><span></span>').addClass('validation-message')
        );
        return this;
    };
    SettingTextView.prototype.render = function(){
        this.apply({
            title : this.title
        }).listen()._render();
        this.renderInputs();
        return this.$el;
    };
})();
