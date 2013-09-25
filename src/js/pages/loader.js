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
    document.getElementsByTagName('title')[0].innerHTML = getInnerText();
};

(function(){
    var url = chrome.extension.getURL('/') + Util.getLoaderBackgroundImage();
    document.getElementsByTagName('html')[0].style.backgroundImage = 'url("'+ url +'")';
    setInterval(incrementDot,100);
})();
