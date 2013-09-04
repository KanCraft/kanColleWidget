(function(){
    var params = parseQueryString();
    applyView(params);
    delegateCarretActions();
    delegateCommitAction(function(finish_time){
        params.finish = finish_time;
        console.log('params', params);
        // TODO: Createshipsモデルを呼び出してaddする
    });
    delegateCancelAction();
})();