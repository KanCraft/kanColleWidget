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

    $('td#version').html(Constants.release.version);
    renderAnnounce();

    $("#reminder-notifications").append(
        (new widgetPages.EnableMissionReminderView()).render(),
        (new widgetPages.DynamicReminderTypeView()).render(),
        (new widgetPages.AllowOcrResultLogView()).render(),
        (new widgetPages.TirednessLengthView()).render(),
        (new widgetPages.PreventForgettingQuestView()).render(),
        (new widgetPages.TextOnMissionStartView()).render()
    );

    $("#notification-settings").append(
        widgetPages.ImageFileSelectView.ofNotificaionIcon().render(),
        (new widgetPages.SoundFileSelectListView()).render(),
        (new widgetPages.TimerFormatRemainedTimeView()).render()
    );

    $("#icon-tools").append(
        (new widgetPages.ImageFormatView()).render(),
        (new widgetPages.CaptureFilenamePrefixView()).render(),
        (new widgetPages.DownloadDirectoryView()).render(),
        (new widgetPages.DisplayMaintenanceInfoView()).render(),
        widgetPages.ImageFileSelectView.ofPopupBackground().render()
    );

    $("#others").append(
        (new widgetPages.AuthTwitterView()).render(),
        (new widgetPages.TweetHashtagView()).render(),
        (new widgetPages.EnableTwitterRemindView()).render(),
        (new widgetPages.SyncSaveTypeView()).render(),
        (new widgetPages.ClockmodeStyleView()).render(),
        (new widgetPages.ShowShipsStatusView()).render(),
        (new widgetPages.ShowOldLaunchView()).render(),
        (new widgetPages.ModifyOriginalTabView()).render(),
        (new widgetPages.UseWhiteModeAsDefaultView()).render(),
        (new widgetPages.HideAdressbarInSafemodeView()).render()
    );

    $('input#auth-twitter').on('click', function(ev) {
        if (ev.currentTarget.checked) {
            chrome.runtime.sendMessage(null, {
                purpose: 'authTwitter'
            });
        } else {
            chrome.runtime.sendMessage(null, {
                purpose: 'authTwitter',
                clear: true
            });
            var message = "ツイッター連携を止める場合は、";
            message += "ツイッターの設定からアプリケーション連携も取り消すことをオススメします。\n";
            message += "twitter.comの設定画面へ移動しますか？";
            if (window.confirm(message)) {
                location.href = "https://twitter.com/settings/applications";
            }
        }
    });
});
function renderAnnounce(){
    // 既読バージョンがアナウンスバージョン以上なら何もしない
    if (! Util.haveNewUpdate()) return;

    $("#announce").append(
        (new widgetPages.AnnounceView(Config)).render()
    ).show();
    return
}

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
        if(key.match(/volume/)) {
            input.value = config[key];
        }

        if(input == null) { continue; }
        if(typeof config[key] === 'boolean'){
            input.checked = config[key];
        } else if(typeof config[key] === 'string') {
            if(key.match('notification-stay-visible')) { continue; }
            if(key.match('offset-millisec')) { continue; }
            if(key.match(/notification-.+?-end-suffix/)) {input.value = config[key]; }
            if(config[key]) { input.innerHTML = '設定済み'; }
        }
    }

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
