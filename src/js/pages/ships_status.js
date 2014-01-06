$(function(){
    var queries = Util.parseQueryString();
    var img = new Image();
    img.src = queries.imgURI;
    $('body').append(img);
    var d = new Date();
    $('title').text(Util.zP(2, d.getHours()) + ":" + Util.zP(2, d.getMinutes()));

    setInterval(function(){
        chrome.runtime.sendMessage({
            purpose  : 'statusWindowPositionTracking',
            position : {
                top  : window.screenTop,
                left : window.screenLeft
            }
        });
    }, 1 * 1000);
});