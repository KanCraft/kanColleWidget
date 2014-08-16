$(function(){

    var alertSize = function(flag) {
        var message = flag;
        message += "\ninnerHeight:\t" + String(window.innerHeight);
        message += "\ninnerWidth:\t" + String(window.innerWidth);
        message += "\nouterHeight:\t" + String(window.outerHeight);
        message += "\nouterWidth:\t" + String(window.outerWidth);
        window.alert(message);
    };
    alertSize("AS IS BEFORE");

    var trackedSize = Tracking.get('statusWindow')['size'];
    var message = "SHOULD BE by tracking";
    message += "\nheight:\t" + trackedSize['height'];
    message += "\nwidth:\t" + trackedSize['width'];
    window.alert(message);

    // {{{ #426
    if (Util.system.isWindows()) {
        window.resizeTo(trackedSize['width'], trackedSize['height']);
    }
    // }}}
    alertSize("AS IS AFTER");

    var message = "innerHeight:\t" + String(window.innerHeight);
    message += "\ninnerWidth:\t" + String(window.innerWidth);
    message += "\nouterHeight:\t" + String(window.outerHeight);
    message += "\nouterWidth:\t" + String(window.outerWidth);

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
