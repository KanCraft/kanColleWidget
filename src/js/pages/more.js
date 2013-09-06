(function(){
    affectConfigInView();
    bindCloseAction();
    bindConfigChangedAction();
})();

function affectConfigInView(){
    var config = Config.getJSON();
    for(var key in config){
        var input = document.getElementById(key);
        if(input == null) continue;
        if(typeof config[key] == 'boolean'){
            input.checked = config[key];
        }
        if(typeof config[key] == 'string'){
            input.value = config[key];
        }
    }
    if(config['notification-img-url']) displayImgSrc(document.getElementById('notification-img'), config['notification-img-url']);
}
function bindCloseAction(){
    document.getElementById('close-config').addEventListener('click', function(){
        window.close();
    });
}
function bindConfigChangedAction(){
    var inputs = document.getElementsByTagName('input');
    for(var i= 0,len=inputs.length;i<len;i++){
        console.log(inputs[i]);
        console.log(inputs[i].type);
        if(inputs[i].type == 'checkbox'){
            inputs[i].addEventListener('change',function(){
                Config.set(this.id, this.checked);
            });
        }
        if(inputs[i].type == 'text'){
            inputs[i].addEventListener('keydown',function(){
                Config.set(this.id, this.value);
            });
        }
        if(inputs[i].type == 'submit'){
            inputs[i].addEventListener('click',function(){
                var target  = document.getElementById(this.getAttribute('target'));
                var display = document.getElementById(this.getAttribute('display'));
                commitNotificationImg(target,display);
            })
        }
    }
}

/* private void */function commitNotificationImg(target, display){
    validationMessage();
    var img_url = target.value;
    if(!validURL(img_url)) {
        return validationMessage('URLが不正っぽいです');
    }
    var request = new XMLHttpRequest();
    request.open('GET', img_url, false);
    request.send();
    if(request.status === 200){
        if(validImageSrc(request)){
            commitImgUrlToConfig(img_url);
            displayImgSrc(display, img_url);
        }
    }else{
        return validationMessage(request.status + ' ' + request.statusText);
    }
}
/* private void */function commitImgUrlToConfig(img_url){
    Config.set('notification-img-url', img_url);
}
/* private void */function displayImgSrc(display, img_url){
    display.src = img_url;
}
/* private bool */function validImageSrc(request_ok){
    console.log(request_ok.getResponseHeader('Content-Type'));
    if(request_ok.getResponseHeader('Content-Type').match(/^image.*/)) return true;
    return false;
}
/* private bool */function validURL(url){
    if(!url) return false;
    if(!url.match(/^http[s]?:\/\/.*\.jpg|jpeg|JPG|gif|GIF|png|PNG$/)) return false;
    return true;
}
/* void */function validationMessage(text, id, kao){
    if(typeof text == 'undefined') text = '';
    if(typeof   id == 'undefined') id = 'notification-img-validation';
    if(typeof  kao == 'undefined') kao = '(ﾟ⊿ﾟ) < ';
    document.getElementById(id).innerHTML = kao + text;
}
