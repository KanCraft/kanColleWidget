var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var KousyouAction = KanColleWidget.KousyouAction = function(){
        this.achievements = new KanColleWidget.Achievements(new KanColleWidget.MyStorage());
        this.precheckKeyword = 'kousyouQuest';
    };
    KousyouAction.prototype = Object.create(KanColleWidget.ActionBase.prototype);
    KousyouAction.prototype.constructor = KousyouAction;

    KousyouAction.prototype.forCreateship = function(params){

        this.achievements.update().incrementCreateshipCount();

        KanColleWidget.Stash.params = params;// tmp
        var dockId = params['api_kdock_id'][0];
        KanColleWidget.Stash.createShip[dockId] = params;

        // 高速建造を使用する
        if(params.api_highspeed == 1) return;

        // 何もしないひと
        if(KanColleWidget.Config.get('dynamic-reminder-type') == 0) return;
        // 常にマニュアル登録のひと
        params.purpose = 'createship';
        if(KanColleWidget.Config.get('dynamic-reminder-type') == 1) return Util.enterTimeManually(params,'src/html/set_manual_timer.html');

        // 他、自動取得しようとするひと
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            var loadingWindow = Util.openLoaderWindow();
            KanColleWidget.Stash.loadingWindow = loadingWindow;
            Util.adjustSizeOfWindowsOS(loadingWindow);
        });
    };
    KousyouAction.prototype.forGetship = function(params){
        var createships = new KanColleWidget.Createships();
        createships.clear(params.api_kdock_id);

        var dockId = params['api_kdock_id'][0];

        // 後方バージョン対応
        if (! KanColleWidget.Stash.createShip) return;
        if (Object.keys(KanColleWidget.Stash.createShip[dockId]).length == 0) return;

        // 設定を見る
        if (! KanColleWidget.Config.get("share-kousyo-result")) return;

        var twitter = new KanColleWidget.Twitter();
        var createshipParams = KanColleWidget.Stash.createShip[dockId];
        twitter.shareCreateShip(createshipParams);
    };
    KousyouAction.prototype.forCreateitem = function(params){
        this.achievements.update().incrementCreateitemCount();
        KanColleWidget.Stash.createItem = params;
    };

    // Completed
    KousyouAction.prototype.forCreateshipCompleted = function(){

        // 高速建造を使用する
        if(KanColleWidget.Stash.params.api_highspeed == 1) return;

        // 何もしないひと
        if(KanColleWidget.Config.get('dynamic-reminder-type') == 0) return;
        // 常にマニュアル登録のひと
        if(KanColleWidget.Config.get('dynamic-reminder-type') == 1) return;

        var callback = function(res){

            // 遅らせてローディング画面を閉じる
            setTimeout(function(){
                KanColleWidget.Stash.loadingWindow.close();
            },600);

            if(!res.result){

                // 失敗しても手動出さない設定ならここで終わる
                if(KanColleWidget.Config.get('dynamic-reminder-type') == 3) return;

                if(!window.confirm("建造終了時間の取得に失敗しました" + Constants.ocr.failureCause + "\n\n手動登録しますか？")) return;
                var params = KanColleWidget.Stash.params;
                params.purpose = 'createship';
                return Util.enterTimeManually(params,'src/html/set_manual_timer.html');
            }

            var finishTimeMsec = Util.timeStr2finishEpochMsec(res.assuredText);
            var createships = new KanColleWidget.Createships();
            createships.add(KanColleWidget.Stash.params.api_kdock_id[0], finishTimeMsec);

            if(!KanColleWidget.Config.get('notification-on-reminder-set')) return;

            Util.presentation(res.assuredText + 'で建造完了通知を登録しときました', {
                startOrFinish: 'start',
                sound: {
                    kind: 'createship-start'
                }
            });
        };

        setTimeout(function(){
            Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
                var proc = new KanColleWidget.Process.DetectTime(chrome, Constants, KanColleWidget.Config);
                proc.forCreateship(widgetWindow.id, KanColleWidget.Stash.params.api_kdock_id[0], callback);
            });
        }, Constants.ocr.delay); //単に描画時間を待つ
    };

    KousyouAction.prototype.forCreateitemComplete = function(){
        if (! KanColleWidget.Stash.createItem) return;

        if (! KanColleWidget.Config.get("share-kousyo-result")) return;

        var twitter = new KanColleWidget.Twitter();
        twitter.shareCreateItem(KanColleWidget.Stash.createItem);
    };
})();
