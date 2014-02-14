$(function(){
    var queries = Util.parseQueryString();
    $('body').attr('style','background-image: url(' + queries.imgURI + ')');
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
