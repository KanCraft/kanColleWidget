$(function(){

    chrome.runtime.sendMessage(null, {
        purpose: 'getConfig',
        configKey: 'modify-original-tab'
    }, function(doModify){
        if (! doModify) return;

        $('body').css({
            //'transform':'scale(0.8)'
            'position': 'fixed',
            'top'     : '-77px',
            'left'    : '-110px'
        });
    });

    history.forward();
});
