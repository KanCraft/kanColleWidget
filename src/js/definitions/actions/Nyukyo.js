/**
 * dependency: Nyukyos
 */

/***** class definitions *****/

function NyukyoAction(){/*** 入渠系のAPIが叩かれたときのアクション ***/}

NyukyoAction.prototype.forStart = function(params){

    Stash.params = params;

    // 高速修復材を使用している場合
    if(params.api_highspeed == 1) return;

    // 何もしないひと
    if(Config.get('dynamic-reminder-type') == 0) return;
    // 常にマニュアル登録のひと
    if(Config.get('dynamic-reminder-type') == 1) return Util.enterTimeManually(params, 'src/html/set_nyukyo.html');

    // 他、自動取得しようとするひと
    var loadingWindow = Util.openLoaderWindow();

    Stash.loadingWindow = loadingWindow;
    Util.adjustSizeOfWindowsOS(loadingWindow);

}
NyukyoAction.prototype.forSpeedchange = function(params){
    var nyukyos = new Nyukyos();
    nyukyos.clear(params.api_ndock_id);
}

// Completed
NyukyoAction.prototype.forStartCompleted = function(){

    // 高速修復材を使用している場合
    if(Stash.params.api_highspeed == 1) return;

    // 何もしないひと
    if(Config.get('dynamic-reminder-type') == 0) return;
    // 常にマニュアル登録のひと
    if(Config.get('dynamic-reminder-type') == 1) return;

    var callback = function(res){

        // 遅らせてローディング画面を閉じる
        setTimeout(function(){
            Stash.loadingWindow.close();
        },600);

        var finishTimeMsec = Util.timeStr2finishEpochMsec(res.result);
        console.log(res);
        if(!finishTimeMsec){
            if(!window.confirm("入渠終了時間の取得に失敗しました" + Constants.ocr.failureCause + "\n\n手動登録しますか？")) return;
            return Util.enterTimeManually(Stash.params,'src/html/set_nyukyo.html');
        }
        var nyukyos = new Nyukyos();
        nyukyos.add(Stash.params.api_ndock_id[0], finishTimeMsec);

        if(!Config.get('notification-on-reminder-set')) return;

        Util.presentation(res.result + 'で入渠修復完了通知を登録しときましたー', {
            sound: {
                kind: 'nyukyo-start'
            }
        });
    };

    setTimeout(function(){
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            var proc = new Process.DetectTime(chrome, Constants);
            proc.forNyukyo(widgetWindow.id, Stash.params.api_ndock_id[0], callback);
        });
    },400); //クレーンが画面内に登場してから数字にかぶる直前までの時間,描画を待つ
}
