(function(){
    var anchors = document.getElementsByTagName('a');
    for(var i=0, len=anchors.length; i<len;i++){
        anchors[i].addEventListener('click',function(e){
            chrome.tabs.create({url:this.getAttribute('href')});
        });
    }
    var checkbox = document.getElementById('doAlert');
    updateChecked();
    checkbox.addEventListener('change',function(e){
        Config.set('enable-notification', this.checked);
        updateChecked();
    });
})();

function updateChecked(){
    var checkbox = document.getElementById('doAlert');
    if(Config.get('enable-notification')) checkbox.setAttribute('checked');
    else checkbox.removeAttribute('checked');
}