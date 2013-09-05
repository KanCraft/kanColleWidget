(function(){
    var params = parseQueryString();
    applyView(params);
    delegateCarretActions();
    delegateCommitAction(function(finish_time){
        params.finish = finish_time;
        // Createshipsモデルを呼び出してaddする
        var createships = new Createships();
        createships.add(params.api_kdock_id, params.finish);
        window.close();
    });
    delegateCancelAction();
})();