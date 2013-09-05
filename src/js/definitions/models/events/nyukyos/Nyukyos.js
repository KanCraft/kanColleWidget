/***** class definitions *****/
function Nyukyos(){/** localStorageにあるnyukyosにアクセスするクラス **/
    this.primaryIdName = 'api_ndock_id';
    this.storageName   = 'nyukyos';
    this.soloModel     = SoloNyukyo;
    this.initialValue  = [
        {api_ndock_id : 1, finish: null},
        {api_ndock_id : 2, finish: null},
        {api_ndock_id : 3, finish: null},
        {api_ndock_id : 4, finish: null}
    ];
}
// extend
Nyukyos.prototype = Object.create(EventsBase.prototype);
Nyukyos.prototype.constructor = Nyukyos;
