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
			if( key == 'notification-sound-volume' ){
				document.getElementById('notification-sound-volume-text').innerHTML = config[key];
			}
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
    	switch(inputs[i].type){
    	case 'checkbox':
            inputs[i].addEventListener('change',function(){
                Config.set(this.id, this.checked);
            });
            break;
    	case 'text':
            inputs[i].addEventListener('keydown',function(){
                Config.set(this.id, this.value);
            });
            break;
    	case 'submit':
            inputs[i].addEventListener('click',function(){
            	if( this.id == 'notification-sound-url-commit' ){
            		_presentation("通知テスト",true);
            	} else {
                    var target = document.getElementById(this.getAttribute('target'));
                    var display = document.getElementById(this.getAttribute('display'));
	                commitNotificationImg(target,display);
            	}
            });
            break;
    	case 'file':
        	inputs[i].addEventListener('change',function(){
                var target = document.getElementById(this.getAttribute('target'));
                var id = this.id;
    			writeLocalFile(this.files[0], this.accept, function(fileEntry){
					var url = fileEntry.toURL();
    				target.value = url;
    				Config.set(target.id, url);
    				if( id == 'notification-img-file' ){
    					displayImgSrc(document.getElementById('notification-img'), url);
    				}
    			});
        	});
        	break;
    	case 'range':
        	inputs[i].addEventListener('change',function(){
                var target = document.getElementById(this.getAttribute('target'));
                target.innerText = this.value;
                Config.set(this.id, this.value);
        	});
    		break;
    	default:
    		break;
    	}
    }
}

/* private void */function commitNotificationImg(target, display){
    validationMessage();
    var img_url = target.value;
    if(img_url.match(/^filesystem:/)){	// ローカルファイル
        commitImgUrlToConfig(img_url);
        displayImgSrc(display, img_url);
        return;
    }

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
