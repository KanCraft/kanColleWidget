/**
 * dependency: Nyukyos
 */

/***** class definitions *****/

function NyukyoAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/}

NyukyoAction.prototype.forStart = function(params){

    // 高速修復材を使用している場合
    if(params.api_highspeed == 1) return;

    // 何もしないひと
    if(!Config.get('dynamic-reminder-type') || Config.get('dynamic-reminder-type') == 0) return;

    // 常にマニュアル登録のひと
    if(Config.get('dynamic-reminder-type') == 1) return Util.enterTimeManually(params, 'src/html/set_nyukyo.html');

    // 他、自動取得しようとするひと
    var callback = function(res){
        var finishTimeMsec = Util.timeStr2finishEpochMsec(res.result);
        console.log(res);
        if(!finishTimeMsec){
            if(!window.confirm("入渠終了時間の取得に失敗しました\n手動登録しますか？")) return;
            return Util.enterTimeManually(params,'src/html/set_nyukyo.html');
        }
        var nyukyos = new Nyukyos();
        nyukyos.add(params.api_ndock_id[0], finishTimeMsec);
    };

    setTimeout(function(){
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            Util.extractFinishTimeFromCapture(
                widgetWindow.id,
                'nyukyo',
                params.api_ndock_id[0],
                callback
            );
        });
    }, 5000);// Thanks to about518
    // Observerのサイクルが5000msecなので、次のcheckに反映させる
}
NyukyoAction.prototype.forSpeedchange = function(params){
    var nyukyos = new Nyukyos();
    nyukyos.clear(params.api_ndock_id);
}
