(function(){
    var anchors = document.getElementsByTagName('a');
    for(var i=0, len=anchors.length; i<len;i++){
        anchors[i].addEventListener('click',function(e){
            chrome.tabs.create({url:this.getAttribute('href')});
        });
    }
    //var checkbox = document.getElementById('doAlert');
    //checkbox.addEventListener('change',function(e){
    //    localStorage.setItem('config_showAlert', this.checked);
    //});
})();