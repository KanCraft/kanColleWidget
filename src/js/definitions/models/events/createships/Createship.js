var KanColleWidget = KanColleWidget || {};
(function(){
    var SoloCreateship = KanColleWidget.SoloCreateship = function(createshipJson){
        this.primaryId = createshipJson.api_kdock_id;
        this.finish    = createshipJson.finish;
        this.prefix    = Constants.notification.createship.end_prefix;
        this.suffix    = Config.get('notification-createship-end-suffix') || Constants.notification.createship.end_suffix;
        this.kind      = 'createship-finish';
        this.label     = '建造完了';
    }
    SoloCreateship.prototype = Object.create(KanColleWidget.SoloEventBase.prototype);
    SoloCreateship.prototype.constructor = SoloCreateship;
})();
