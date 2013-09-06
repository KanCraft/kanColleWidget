(function(){
    var params = parseQueryString();
    applyView(params);
    affectInputTracking('createship');
    delegateCarretActions();
    delegateCommitAction(function(finish_time){
        params.finish = finish_time;
        // Createshipsモデルを呼び出してaddする
        var createships = new Createships();
        createships.add(params.api_kdock_id, params.finish);
        updateInputTracking('createship');
        _presentation('建造作業完了通知を登録しときました',false,function(){
            window.close();
        });
    });
    delegateCancelAction();
})();