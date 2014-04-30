/***** class definitions *****/
function SoloNyukyo(json){
    this.primaryId = json.api_ndock_id;
    this.finish    = json.finish;
    this.prefix    = Constants.notification.nyukyo.end_prefix;
    this.suffix    = Config.get('notification-nyukyo-end-suffix') || Constants.notification.nyukyo.end_suffix;
    this.kind      = 'nyukyo-finish';
    this.label     = '入渠修復完了';
}
SoloNyukyo.prototype = Object.create(KanColleWidget.SoloEventBase.prototype);
SoloNyukyo.prototype.constructor = SoloNyukyo;
