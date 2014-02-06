/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var SettingSelectView = widgetPages.SettingSelectView = function(){};
    Util.extend(SettingSelectView, widgetPages.View);

    SettingSelectView.prototype.tpl = '<tr>'
                                    + '    <td class="title">{{title}}</td>'
                                    + '    <td class="select-container"></td>'
                                    + '</tr>';

    SettingSelectView.prototype.listen = function(config) {
        this.config = config || Config;
        var eventKey = 'change .' + this.inputName;
        this.events = this.events || {};
        this.events[eventKey] = "_listenSelectChange";
        return this;
    };

    SettingSelectView.prototype._listenSelectChange = function(ev, self){
        var val = $(ev.target).val();
        return self.config.set(self.inputName, val);
    };

    SettingSelectView.prototype.renderOptions = function(){
        var nowSelectedValue = this.config.get(this.inputName);
        var $select = $('<select></select>').addClass(this.inputName);
        for (var i in this.elements) {
            var el = this.elements[i];
            var $option = $('<option></option>');
            $option.attr({
                'value' : el.value
            });
            $option.text(el.title);
            if (el.value == nowSelectedValue) $option.attr({selected:true});
            $select.append($option);
        }
        this.$el.find('.select-container').append(
            $select,
            $('<span class="description xsmall"></span>').text(this.description)
        );
        return this;
    };

    SettingSelectView.prototype.render = function(){
        this.apply({
            title : this.title
        }).listen()._render();
        this.renderOptions();
        return this.$el;
    };
})();
