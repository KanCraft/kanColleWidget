(function(){
    var params = parseQueryString();
    applyView(params);
    affectInputTracking('createship');
    delegateValidation();
    delegateCarretActions();
    delegateCancelAction();
    delegateCommitAction(function(finish_time){
        params.finish = finish_time;
        // Createshipsモデルを呼び出してaddする
        var createships = new Createships();
        createships.add(params.api_kdock_id, params.finish);
        updateInputTracking('createship');

        if(!Config.get('notification-on-reminder-set')) return window.close();

        Util.presentation('建造作業完了通知を登録しときました', {
            callback : function(){ setTimeout(window.close, 200); },
            sound: {
                kind: 'createship-start'
            }
        });
    });
})();
