$(function(){
    affectConfigInView();
    bindCloseAction();
    bindConfigChangedAction();
    bindResetButtons();

    var key = 'notification-offset-millisec';
    $('#' + key).val(parseInt(Config.get(key), 10));
    $('#' + key).on('change',function(){
        Config.set(key, $(this).val());
    });

    $("#reminder-notifications").append(
        (new widgetPages.EnableMissionReminderView()).render(),
        (new widgetPages.DynamicReminderTypeView()).render(),
        (new widgetPages.AllowOcrResultLogView()).render()
    );
    $("#icon-tools").append(
        (new widgetPages.ImageFormatView()).render()
    );
});

function affectConfigInView(){
    var config = Config.getJSON();
    for(var key in config){
        if(typeof config[key] === 'number'){
            var inputs = document.getElementsByClassName(key);
            for(var i= 0,len=inputs.length;i<len;i++){
                if(inputs[i].value == config[key]){
                    inputs[i].checked = true;
                    break;
                }
            }
        }

        var input = document.getElementById(key);
        if(key.match(/^notification.*file$/)) {
            input = document.getElementById(key + '-already-set');
        }

        if(key.match(/volume/)) {
            input.value = config[key];
        }

        if(input == null) { continue; }
        if(typeof config[key] === 'boolean'){
            input.checked = config[key];
        } else if(typeof config[key] === 'string') {
            if(key.match('notification-stay-visible')) { continue; }
            if(key.match('offset-millisec')) { continue; }
            if(config[key]) { input.innerHTML = '設定済み'; }
        }
    }
    if(config['notification-img-file']) displayImgSrc(document.getElementById('notification-img'), config['notification-img-file']);
    if(config['popup-bg-img-file']) displayImgSrc(document.getElementById('popup-bg-img'), config['popup-bg-img-file']);

    $('select').each(function() {
        var sel = $(this);
        var val = Config.get(sel.attr('id'));
        sel.val(val);
    });
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
        case 'radio':
            inputs[i].addEventListener('change',function(){
                Config.set(this.name, parseInt(this.value));
            });
            break;
    	  case 'text':
            inputs[i].addEventListener('keyup',function(){
                Config.set(this.id, this.value);
            });
            break;
    	  case 'submit':
            inputs[i].addEventListener('click', function() {
                var kind = $(this).attr('data-kind');
                testNotificationSound(kind);
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
                        Config.set(res.purpose + '-force', true);
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

    // select要素に対してのバインド
    $('select').each(function(select) {
        $(this).change(function() {
            Config.set(this.id, this.value);
        });
    });
}

function bindResetButtons(){
    $('.reset').each(function(index){
        $(this).on('click',function(e){
            var target = $(this).attr('target');
            Config.set(target, '');
            $('span#'+target+'-already-set').html('');
            $('#'+target+'-validation').html('デフォルトに戻しました');
        });
    });
}

/* private void */function testNotificationSound(kind) {
    var d = new Date();
    var text = "通知テスト\n" + d.toLocaleDateString() + " " + d.toLocaleTimeString();
    Util.presentation(text, {
        sound: {
            kind  : kind,
            force : true
        }
    });
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
    var mess = document.getElementById(id);
    if(mess) mess.innerHTML = text;
}
/* string */function hideFileRootFromPath(path){
    return path.replace(/^filesystem:chrome-extension:\/\/[a-zA-Z]*\/persistent\//, '');
}

$(function() {
    $('#open-notification-sound-extend').click(function() {
        $('#notification-sound-extend').slideDown();
        $(this).css('display', 'none');
    });
    $('#close-notification-sound-extend').click(function() {
        $('#notification-sound-extend').slideUp();
        $('#open-notification-sound-extend').css('display','');
    });
});
