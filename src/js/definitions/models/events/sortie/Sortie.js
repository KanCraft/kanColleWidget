/***** class definitions *****/
function SoloSortie(sortieJson){
    this.primaryId = sortieJson.api_kdock_id;
    this.finish    = sortieJson.finish;
    this.prefix    = Constants.notification.sortie.end_prefix;
    this.suffix    = Config.get('notification-sortie-end-suffix') || Constants.notification.sortie.end_suffix;
    this.kind      = 'sortie-finish';
}
SoloSortie.prototype = Object.create(SoloEventBase.prototype);
SoloSortie.prototype.constructor = SoloSortie;
