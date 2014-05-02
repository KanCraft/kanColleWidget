var KanColleWidget = KanColleWidget || {};

(function(){
    var SoloSortie = KanColleWidget.SoloSortie = function(sortieJson){
        this.primaryId = sortieJson.api_deck_id;
        this.finish    = sortieJson.finish;
        this.prefix    = Constants.notification.sortie.end_prefix;
        this.suffix    = Config.get('notification-sortie-end-suffix') || Constants.notification.sortie.end_suffix;
        this.kind      = 'sortie-finish';
        this.label     = '疲労回復';
    }
    SoloSortie.prototype = Object.create(KanColleWidget.SoloEventBase.prototype);
    SoloSortie.prototype.constructor = SoloSortie;
})();
