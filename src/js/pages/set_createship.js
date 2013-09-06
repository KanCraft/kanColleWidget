(function(){
    var params = parseQueryString();
    applyView(params);
    affectInputTracking('createship');
    delegateCarretActions();
    delegateCommitAction('createship', function(finish_time){
        params.finish = finish_time;
        // Createshipsモデルを呼び出してaddする
        var createships = new Createships();
        createships.add(params.api_kdock_id, params.finish);
        window.close();
    });
    delegateCancelAction();
})();