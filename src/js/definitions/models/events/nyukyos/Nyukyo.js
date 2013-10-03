/***** class definitions *****/
function SoloNyukyo(json){
    this.primaryId = json.api_ndock_id;
    this.finish    = json.finish;
    this.prefix    = Constants.notification.nyukyo.end_prefix;
    this.suffix    = Config.get('notification-nyukyo-end-suffix') || Constants.notification.nyukyo.end_suffix;
    this.kind      = 'nyukyo-finish';
}
SoloNyukyo.prototype = Object.create(SoloEventBase.prototype);
SoloNyukyo.prototype.constructor = SoloNyukyo;
