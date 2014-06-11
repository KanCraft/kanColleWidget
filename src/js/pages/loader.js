var count = 0;
var maxCount = 10;
var getInnerText = function(){
    var text = '取得中';
    if(count == maxCount){
        count = 0;
        return text;
    }
    for(var i=0;i<count;i++){
        text += '.';
    }
    count++;
    return text;
};
var incrementDot = function(){
    $('title').html(getInnerText());
};

(function(){
    var image = Util.getLoaderBackgroundImage();
    var url = chrome.extension.getURL('/') + image.url;
    $('html').css({backgroundImage:'url("'+ url +'")'});
    $('html').hide().fadeIn(500);
    setInterval(incrementDot,100);
    $('div#answer').html(image.title);
    $('div#wrapper').on('mouseenter',function(){
        $('div#answer').show();
    });
    $('div#wrapper').on('mouseleave',function(){
        $('div#answer').hide();
    });
})();
