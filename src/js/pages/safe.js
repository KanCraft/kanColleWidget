$(function(){
    setTimeout(function(){
        $('body').css({
            //'transform':'scale(0.8)'
            'position': 'fixed'
        });
        $('body').animate({
            'top'     : '-76px',
            'left'    : '-110px'
        },500);
    },500);


    // リサイズ
    chrome.runtime.sendMessage({purpose:'resizeWindowAtWhite'});

    // ウィンドウを閉じる前に確認が必要なら beforeunload を設定
    chrome.runtime.sendMessage(null, {
        purpose: 'getConfig',
        configKey: 'ask-before-window-close'
    }, function (doAsk) {
        if (doAsk) {
            $(window).on('beforeunload', function () {return window.document.title});
        }
    });

    // キーバインド登録
    /* {{{ ここはmanifest.jsonでどうにかなるんだってさ
    $(document).on('keyup',function(e){
        if(e.shiftKey && e.ctrlKey && e.keyCode === 48){
            chrome.runtime.sendMessage({purpose: 'screenshot'});
        }
    });
    }}} */

    history.forward();

    $(document).on('keyup',function(e){

        if (! e.shiftKey) return;
        if (! e.ctrlKey) return;

        if (e.keyCode === 48) {
            chrome.runtime.sendMessage(null, {purpose: 'screenshot'});
        }
    });

});
