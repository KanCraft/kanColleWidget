/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var SettingCheckboxView = widgetPages.SettingCheckboxView = function(){};
    SettingCheckboxView.prototype = Object.create(widgetPages.View.prototype);
    SettingCheckboxView.prototype.constructor = SettingCheckboxView;

    SettingCheckboxView.prototype.tpl = '<tr>'
                                      + '    <td class="title">{{title}}</td>'
                                      + '    <td class="checkbox-container"></td>'
                                      + '</tr>';

    SettingCheckboxView.prototype.listen = function(config) {
        this.config = config || Config;
        var eventKey = 'change .' + this.inputName;
        this.events = this.events || {};
        this.events[eventKey] = "_listenCheckboxChanged";
        return this;
    };

    SettingCheckboxView.prototype._listenCheckboxChanged = function(ev, self){
        var checked = $(ev.target).is(':checked');
        return self.config.set(self.inputName, checked);
    };

    SettingCheckboxView.prototype.renderInputs = function(){
        var nowSelectedValue = this.config.get(this.inputName);
        var $_container = $('<div>');
        var $input = $('<input type="checkbox"></input>');
        $input.attr({
            'id'      : this.inputName,
            'name'    : this.inputName,
            'checked' : this.config.get(this.inputName)
        });

        $_container.append($input);
        this.$el.find('.checkbox-container').append($_container);
        if (this.description) $_container.append(this.description);
        return this;
    };

    SettingCheckboxView.prototype.render = function(){
        this.apply({
            title : this.title
        }).listen()._render();
        this.renderInputs();
        return this.$el;
    };
})();
