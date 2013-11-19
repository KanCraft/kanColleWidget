/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var SettingRadioButtonView = widgetPages.SettingRadioButtonView = function(){};
    SettingRadioButtonView.prototype = Object.create(widgetPages.View.prototype);
    SettingRadioButtonView.prototype.constructor = SettingRadioButtonView;

    SettingRadioButtonView.prototype.tpl = '<tr>'
                                         + '    <td class="title">{{title}}</td>'
                                         + '    <td class="radio-container"></td>'
                                         + '</tr>';

    SettingRadioButtonView.prototype.listen = function() {
        var eventKey = 'change .' + this.inputName;
        this.events[eventKey] = "_listenRadioChange";
        return this;
    };

    SettingRadioButtonView.prototype._listenRadioChange = function(ev, self){
        console.log(ev,self);
    };

    SettingRadioButtonView.prototype.renderInputs = function(){
        var $_container = $('<div>');
        for (var i in this.elements) {
            var el = this.elements[i];
            var $input = $('<input type="radio"></input>');
            $input.attr({
                'class' : this.inputName,
                'name'  : this.inputName,
                'value' : el
            }).text(el);
            if (i != 0) $_container.append($('<br>'));
            $_container.append($input);
        }
        this.$el.find('.radio-container').append($_container);
        return this;
    };
})();
