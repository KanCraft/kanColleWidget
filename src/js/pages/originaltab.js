$(function(){

    chrome.runtime.sendMessage(null, {
        purpose: 'getConfig',
        configKey: 'modify-original-tab'
    }, function(doModify){
        if (! doModify) return;

        $('body').css({
            //'transform':'scale(0.8)'
            'position': 'fixed',
            'top'     : '-75px',
            'left'    : '-70px'
        });
    });

    history.forward();
});
