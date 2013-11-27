var widgetPages = widgetPages || {};

(function() {
    var TirednessListView = widgetPages.TirednessListView = function() {
        this.sorties = new KanColleWidget.Sorties();
        this.tpl = '<table></table>';
        this.events = {
        };
        this.attrs = {
            id : "tiredness-list",
            class : "table"
        };
    };
    TirednessListView.prototype = Object.create(widgetPages.View.prototype);
    TirednessListView.prototype.constructor = TirednessListView;
    TirednessListView.prototype.render = function(){
        this.apply()._render();
        var self = this;
        $.map(this.sorties.getAll(), function(sortie){
            var tirednessView = new widgetPages.TirednessView(sortie);
            self.$el.append(tirednessView.render());
        });
        return self.$el;
    };
})();
