/***** class definitions *****/
function SoloCreateship(createshipJson){
    this.primaryId = createshipJson.api_kdock_id;
    this.finish    = createshipJson.finish;
    this.prefix    = Constants.notification.createship.end_prefix;
    this.suffix    = Config.get('notification-createship-end-suffix') || Constants.notification.createship.end_suffix;
    this.kind      = 'construction-finish';
}
SoloCreateship.prototype = Object.create(SoloEventBase.prototype);
SoloCreateship.prototype.constructor = SoloCreateship;
