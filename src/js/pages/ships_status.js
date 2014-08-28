$(function(){

    // {{{ #426, #444
        if (Util.system.isWindows()) {
        // #426
        var trackedSize = Tracking.get('statusWindow')['size'];
        window.resizeTo(trackedSize['width'], trackedSize['height']);
        // #444
        var trackedPstn = Tracking.get('statusWindow')['position'];
        window.moveBy(trackedPstn['left'] - window.screenX, trackedPstn['top'] - window.screenY);
    }
    // }}}

    var queries = Util.parseQueryString();
    var img = new Image();
    img.src = queries.imgURI;
    img.setAttribute('class','contain-page');
    window.document.body.appendChild(img);

    // おまじない〜ww
    // https://twitter.com/otiai10/status/475116250863915008
    $('img').hide().fadeIn(500);

    var d = new Date();
    $('title').text(Util.zP(2, d.getHours()) + ":" + Util.zP(2, d.getMinutes()));

    $('body').on('click', function(e){
        Util.focusKCWidgetWindow();
    });

    setInterval(function(){
        chrome.runtime.sendMessage({
            purpose  : 'statusWindowPositionTracking',
            position : {
                top  : window.screenTop,
                left : window.screenLeft
            },
            size: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
    }, 1 * 1000);
});
