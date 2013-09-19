/**
 * dependency: Createships
 */

/***** class definitions *****/

function KousyouAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/
    this.achievements = new Achievements();
}

KousyouAction.prototype.forCreateship = function(params){

    this.achievements.update().incrementCreateshipCount();

    // 高速建造を使用する
    if(params.api_highspeed == 1) return;

    // 何もしないひと
    if(!Config.get('dynamic-reminder-type') || Config.get('dynamic-reminder-type') == 0) return;

    // 常にマニュアル登録のひと
    if(Config.get('dynamic-reminder-type') == 1) return Util.enterTimeManually(params,'src/html/set_createship.html');

    // 他、自動取得しようとするひと
    var callback = function(res){
        var finishTimeMsec = Util.timeStr2finishEpochMsec(res.result);
        console.log(res);
        if(!finishTimeMsec){
            if(!window.confirm("建造終了時間の取得に失敗しました\n手動登録しますか？")) return;
            return Util.enterTimeManually(params,'src/html/set_createship.html');
        }
        var createships = new Createships();
        createships.add(params.api_kdock_id[0], finishTimeMsec);

        if(!Config.get('notification-on-reminder-set')) return;

        Util.presentation(res.result + 'で建造完了通知を登録しときました');
    };

    setTimeout(function(){
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            //chrome.runtime.sendMessage(message);
            Util.extractFinishTimeFromCapture(
                widgetWindow.id,
                'createship',
                params.api_kdock_id[0],
                callback
            );
        });
    }, 5000);// Thanks to about518
    // Observerのサイクルが5000msecなので、次のcheckに反映させる
}
KousyouAction.prototype.forGetship = function(params){
    var createships = new Createships();
    createships.clear(params.api_kdock_id);
}
KousyouAction.prototype.forCreateitem = function(params){
    this.achievements.update().incrementCreateitemCount();
}
