var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var NyukyoAction = KanColleWidget.NyukyoAction = function(){
        this.precheckKeyword = 'nyukyoQuest';
    };
    NyukyoAction.prototype = Object.create(KanColleWidget.ActionBase.prototype);
    NyukyoAction.prototype.constructor = NyukyoAction;

    NyukyoAction.prototype.forStart = function(params){

        KanColleWidget.Stash.params = params;

        var achievements = new KanColleWidget.Achievements(new KanColleWidget.MyStorage());
        achievements.incrementNyukyoCount();

        // 高速修復材を使用している場合
        if(params.api_highspeed == 1) return;

        // 何もしないひと
        if(KanColleWidget.Config.get('dynamic-reminder-type') == 0) return;
        // 常にマニュアル登録のひと
        params.purpose = 'nyukyo';
        if(KanColleWidget.Config.get('dynamic-reminder-type') == 1) return Util.enterTimeManually(params, 'src/html/set_manual_timer.html');

        // 他、自動取得しようとするひと
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            var loadingWindow = Util.openLoaderWindow();
            KanColleWidget.Stash.loadingWindow = loadingWindow;
            Util.adjustSizeOfWindowsOS(loadingWindow);
        });
    }
    NyukyoAction.prototype.forSpeedchange = function(params){
        var nyukyos = new KanColleWidget.Nyukyos();
        nyukyos.clear(params.api_ndock_id);
    }

    // Completed
    NyukyoAction.prototype.forStartCompleted = function(){

        // 高速修復材を使用している場合
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

                if(!window.confirm("入渠終了時間の取得に失敗しました" + Constants.ocr.failureCause + "\n\n手動登録しますか？")) return;
                var params = KanColleWidget.Stash.params;
                params.purpose = 'nyukyo';
                return Util.enterTimeManually(params,'src/html/set_manual_timer.html');
            }

            var finishTimeMsec = Util.timeStr2finishEpochMsec(res.assuredText);
            var nyukyos = new KanColleWidget.Nyukyos();
            nyukyos.add(KanColleWidget.Stash.params.api_ndock_id[0], finishTimeMsec);

            if(!KanColleWidget.Config.get('notification-on-reminder-set')) return;

            Util.presentation(res.assuredText + 'で入渠修復完了通知を登録しときましたー', {
                startOrFinish: 'start',
                sound: {
                    kind: 'nyukyo-start'
                }
            });
        };

        setTimeout(function(){
            Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
                var proc = new Process.DetectTime(chrome, Constants, KanColleWidget.Config);
                proc.forNyukyo(widgetWindow.id, KanColleWidget.Stash.params.api_ndock_id[0], callback);
            });
        }, Constants.ocr.delay); //クレーンが画面内に登場してから数字にかぶる直前までの時間,描画を待つ
    };
})();
