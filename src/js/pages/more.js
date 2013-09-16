(function(){
    affectConfigInView();
    bindCloseAction();
    bindConfigChangedAction();
})();

function affectConfigInView(){
    var config = Config.getJSON();
    for(var key in config){

        var input = document.getElementById(key);
        if(key.match(/^notification.*file$/)) input = document.getElementById(key + '-already-set');

        if(input == null) continue;
        if(typeof config[key] == 'boolean'){
            input.checked = config[key];
        }
        if(typeof config[key] == 'string'){
            if(typeof input.value == 'undefined') input.innerHTML = hideFileRootFromPath(config[key]);
            else input.value = config[key];
        }
    }
    if(config['notification-img-file']) displayImgSrc(document.getElementById('notification-img'), config['notification-img-file']);
}
function bindCloseAction(){
    document.getElementById('close-config').addEventListener('click', function(){
        window.close();
    });
}
function bindConfigChangedAction(){
    var inputs = document.getElementsByTagName('input');
    for(var i= 0,len=inputs.length;i<len;i++){
        // TODO: typeでディスパッチするのではなく、idでディスパッチする -> otiai10
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
                    testNotificationSound();
            });
            break;
    	case 'file':
        	inputs[i].addEventListener('change',function(){
                var target = document.getElementById(this.getAttribute('target'));
                var purpose = this.id;
                Fs.update(purpose, this.files[0], this.accept, function(res){
                    if(res.status == 0){
                        Config.set(res.purpose, '');
                        validationMessage(res.message + '、デフォルトに戻しました', purpose + '-validation');
                    }else if(res.status == 1){
                        Config.set(res.purpose, res.entry.toURL());
                        validationMessage( res.origin.name + 'に設定しました', purpose + '-validation');
                    }
                    affectConfigInView();
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

/* private void */function testNotificationSound(){
    var d = new Date();
    var text = "通知テスト\n" + d.toLocaleDateString() + " " + d.toLocaleTimeString();
    Util.presentation(text, true);
}

/* private void */function commitImgUrlToConfig(img_url){
    Config.set('notification-img-url', img_url);
}
/* private void */function displayImgSrc(display, img_url){
    display.src = img_url;
}
/* private bool */function validImageSrc(request_ok){
    if(request_ok.getResponseHeader('Content-Type').match(/^image.*/)) return true;
    return false;
}
/* private bool */function validURL(url){
    if(!url) return false;
    if(!url.match(/^http[s]?:\/\/.*\.jpg|jpeg|JPG|gif|GIF|png|PNG$/)) return false;
    return true;
}
/* void */function validationMessage(text, id, opt){
    if(typeof text == 'undefined') text = '';
    if(typeof   id == 'undefined') id = 'notification-img-file-validation';
    document.getElementById(id).innerHTML = text;
}
/* string */function hideFileRootFromPath(path){
    return path.replace(/^filesystem:chrome-extension:\/\/[a-zA-Z]*\/persistent\//, '');
}
