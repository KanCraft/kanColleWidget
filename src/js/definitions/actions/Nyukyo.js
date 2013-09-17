/**
 * dependency: Nyukyos
 */

/***** class definitions *****/

function NyukyoAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/}

NyukyoAction.prototype.forStart = function(params){

    if(params.api_highspeed == 1) return; // 高速修復を使用する
    if(!Config.get('enable-dynamic-reminder')) return; // 動的リマインダ機能を使ってないひとはスルー

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
