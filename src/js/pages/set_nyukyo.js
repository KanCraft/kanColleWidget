(function(){
    var params = parseQueryString();
    applyView(params);
    affectInputTracking('nyukyo');
    delegateCarretActions();
    delegateCancelAction();
    delegateCommitAction(function(finish_time){
        params.finish = finish_time;
        // Nyukyosモデルを呼び出してaddする
        var nyukyos = new Nyukyos();
        nyukyos.add(params.api_ndock_id, params.finish);
        updateInputTracking('nyukyo');

        if(!Config.get('notification-on-reminder-set')) return window.close();

        Util.presentation('入渠修復作業完了通知を登録しときました',{
            callback : function(){ setTimeout(window.close, 200); }
        });
    });
})();