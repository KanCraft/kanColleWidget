/**
 * dependency: Createships
 */

/***** class definitions *****/

function KousyouAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/
    this.achievements = new KanColleWidget.Achievements(new MyStorage());
}

KousyouAction.prototype.forCreateship = function(params){

    this.achievements.update().incrementCreateshipCount();

    KanColleWidget.Stash.params = params;// tmp
    KanColleWidget.Stash.createShip[params['api_kdock_id'][0]] = params;

    // 高速建造を使用する
    if(params.api_highspeed == 1) return;

    // 何もしないひと
    if(Config.get('dynamic-reminder-type') == 0) return;
    // 常にマニュアル登録のひと
    if(Config.get('dynamic-reminder-type') == 1) return Util.enterTimeManually(params,'src/html/set_createship.html');

    // 他、自動取得しようとするひと
    Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
        var loadingWindow = Util.openLoaderWindow();
        KanColleWidget.Stash.loadingWindow = loadingWindow;
        Util.adjustSizeOfWindowsOS(loadingWindow);
    });
}
KousyouAction.prototype.forGetship = function(params){
    var createships = new Createships();
    createships.clear(params.api_kdock_id);

    // 後方バージョン対応
    if (! KanColleWidget.Stash.createShip || ! KanColleWidget.Stash.createShip[params['api_kdock_id'][0]]) return;

    // 設定を見る
    if (! Config.get("share-kousyo-result")) return;

    var twitter = new KanColleWidget.Twitter();
    var createshipParams = KanColleWidget.Stash.createShip[params['api_kdock_id'][0]];
    twitter.shareCreateShip(createshipParams);
}
KousyouAction.prototype.forCreateitem = function(params){
    this.achievements.update().incrementCreateitemCount();
    KanColleWidget.Stash.createItem = params;
}

// Completed
KousyouAction.prototype.forCreateshipCompleted = function(){

    // 高速建造を使用する
    if(KanColleWidget.Stash.params.api_highspeed == 1) return;

    // 何もしないひと
    if(Config.get('dynamic-reminder-type') == 0) return;
    // 常にマニュアル登録のひと
    if(Config.get('dynamic-reminder-type') == 1) return;

    var callback = function(res){

        // 遅らせてローディング画面を閉じる
        setTimeout(function(){
            KanColleWidget.Stash.loadingWindow.close();
        },600);

        if(!res.result){
            if(!window.confirm("建造終了時間の取得に失敗しました" + Constants.ocr.failureCause + "\n\n手動登録しますか？")) return;
            return Util.enterTimeManually(KanColleWidget.Stash.params,'src/html/set_createship.html');
        }

        var finishTimeMsec = Util.timeStr2finishEpochMsec(res.assuredText);
        var createships = new Createships();
        createships.add(KanColleWidget.Stash.params.api_kdock_id[0], finishTimeMsec);

        if(!Config.get('notification-on-reminder-set')) return;

        Util.presentation(res.assuredText + 'で建造完了通知を登録しときました', {
            startOrFinish: 'start',
            sound: {
                kind: 'createship-start'
            }
        });
    };

    setTimeout(function(){
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            var proc = new Process.DetectTime(chrome, Constants, Config);
            proc.forCreateship(widgetWindow.id, KanColleWidget.Stash.params.api_kdock_id[0], callback);
        });
    }, Constants.ocr.delay); //単に描画時間を待つ
}

KousyouAction.prototype.forCreateitemComplete = function(){
    if (! KanColleWidget.Stash.createItem) return;

    if (! Config.get("share-kousyo-result")) return;

    var twitter = new KanColleWidget.Twitter();
    twitter.shareCreateItem(KanColleWidget.Stash.createItem);
};
