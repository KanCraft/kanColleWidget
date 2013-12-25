var widgetPages = widgetPages || {};

(function() {
    var TirednessListView = widgetPages.TirednessListView = function() {
        this.sorties = new KanColleWidget.Sorties();
        this.tpl = '<div id="tiredness-contents" class="contents">'
                  +'    <h5 id="tiredness-title" style="margin-top:20px">簡易疲労度メーター</h5>'
                  +'    <div id="tiredness-container">'
                  +'        <table id="tiredness-list" class="table"></table>'
                  +'    </div>'
                  +'</div>';
    };
    TirednessListView.prototype = Object.create(widgetPages.View.prototype);
    TirednessListView.prototype.constructor = TirednessListView;
    TirednessListView.prototype.render = function(){
        this.apply()._render();
        if (Config.get('tiredness-recovery-minutes') == 0) return '';
        this.refreshTable();
        return this.$el;
    };
    TirednessListView.prototype.refreshTable = function(){
        var $trs = [];
        $.map(this.sorties.getAll(), function(sortie){
            var tirednessView = new widgetPages.TirednessView(sortie);
            $trs.push(tirednessView.render());
        });
        this.$el.find('table').html($trs);
    };
    TirednessListView.prototype.update = function(){
        this.refreshTable();
    };
})();
