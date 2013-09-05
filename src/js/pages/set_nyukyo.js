(function(){
    var params = parseQueryString();
    applyView(params);
    delegateCarretActions();
    delegateCommitAction(function(finish_time){
        params.finish = finish_time;
        // Nyukyosモデルを呼び出してaddする
        var nyukyos = new Nyukyos();
        nyukyos.add(params.api_ndock_id, params.finish);
        window.close();
    });
    delegateCancelAction();
})();