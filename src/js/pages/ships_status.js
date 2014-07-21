$(function(){
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

    var ratio = 1;
    if (Util.system.isWindows()) {
        ratio = (win.devicePixelRatio || 1);
    }

    setInterval(function(){
        chrome.runtime.sendMessage({
            purpose  : 'statusWindowPositionTracking',
            position : {
                top  : window.screenTop,
                left : window.screenLeft
            },
            size: {
                width: Math.ceil(window.innerWidth * ratio),
                height: Math.ceil(window.innerHeight * ratio)
            }
        });
    }, 1 * 1000);
});
