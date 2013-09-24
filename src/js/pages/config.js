(function(){
    var anchors = document.getElementsByTagName('a');
    for(var i=0, len=anchors.length; i<len;i++){
        anchors[i].addEventListener('click',function(e){
            chrome.tabs.create({url:this.getAttribute('href')});
        });
    }
})();
