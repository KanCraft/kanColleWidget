(function(){
    var params = parseQueryString();
    applyView(params);
    // たぶんいらない affectInputTracking('mission');
    delegateValidation();
    delegateCarretActions();
    delegateCancelAction();
    delegateCommitAction(function(finish_time){
        params.finish = finish_time;
        // Missionsモデルを呼び出してaddする
        var missions = new Missions();
        missions.add(params.deck_id, params.finish);
        // たぶんいらない updateInputTracking('nyukyo');

        if(!Config.get('notification-on-reminder-set')) return window.close();

        Util.presentation('遠征完了通知を登録しときました',{
            callback : function(){ setTimeout(window.close, 200); },
            startOrFinish: 'start',
            sound: {
                kind: 'mission-start'
            }
        });
    });
})();
