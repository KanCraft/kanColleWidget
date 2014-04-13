
function toggleAchievementsArea(switcher){
    var div = document.getElementById('achievements');
    _toggleArea(div,switcher);
}
function _toggleArea(e, sw){
    if(sw == true){
        e.style.display = '';
    }
    if(sw == false){
        e.style.display = 'none';
    }
}

/* zero_padding: string */function zP(order, text){
    for(var i=0;i<order;i++){
        text = '0' + text;
    }
    return text.slice(order*(-1));
}

/* void */function uncheckAll(){
    var checkboxes = document.getElementsByTagName('input');
    for(var i= 0,len=checkboxes.length;i<len;i++){
        checkboxes[i].checked = false;
    }
}

/* void */function updateAchievements(){

    if(!Config.get('record-achievements')) return toggleAchievementsArea(false);

    var achievements = new KanColleWidget.Achievements(new MyStorage());
    var achievements_json = achievements.update().toJson();
    for(var key in achievements_json.daily.contents){
        document.getElementById('daily-' + key).innerHTML  = achievements_json.daily.contents[key];
    }
    for(var key in achievements_json.weekly.contents){
        document.getElementById('weekly-' + key).innerHTML  = achievements_json.weekly.contents[key];
    }
}

/* void */function changeTitle(){
    var title = Config.get('popup-select-title') || Constants.popup.title;
    document.getElementById('popup-select-title').innerHTML = title;
}
/* void */function affectTracking(){
    var trackedMode = Tracking.get('mode');
    var inputs = document.getElementsByClassName('mode-select');
    for(var i=0;i<inputs.length;i++){
        inputs[i].checked = false;
    }
    var input = document.getElementById('mode-' + trackedMode);
    input.checked = true;
}
/* void */function prepareForScreenShot(){
    Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
        if(!Config.get('enable-screen-shot')){
            document.getElementById('screen-shot').style.display = 'none';
        }
    },function(){
        document.getElementById('screen-shot').style.display = 'none';
    });
}
/* void */function affectPopupBackground(){
    if(!Config.get('popup-bg-img-file')) return;

    var html = document.getElementsByTagName('html')[0];
    html.style.backgroundImage = "url('" + Config.get('popup-bg-img-file') + "')";
}

(function(){

    /*
    // sync storageがあればロードするし
    // sync storageが無ければlocalを優先する
    MyStorage.sync.load();
    */

    $('a.link').on('click',function(){
        chrome.tabs.create({url:$(this).attr('data-href')});
    });

    updateAchievements();
    changeTitle();

    affectPopupBackground();

    var this_select_window = window;
    $('#launch-safely').on('click',function(){
        Util.openSafeMode();
    });

    $('#screen-shot').on('click',function(){
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            chrome.runtime.sendMessage({winId: widgetWindow.id});
            window.close();
        });
    });
    if (Config.get('show-old-launch')) {
        $('#old-launch').show();
    }
    $('#hide-launch').on('click',function(){
        Config.set('show-old-launch', false);
        $('#old-launch').hide();
    });
    $('#launch').on('click', function(){
        var mode = $('input:radio[name="mode"]:checked').val();
        Tracking.set('mode',mode);
        Util.focusOrLaunchIfNotExists(mode, function(widgetWindow,newWidth){
            if(typeof widgetWindow != 'undefined'){
                // 指定のサイズに修正
                var size = Tracking.get('widget').size;
                var frameWidth = size.outerWidth - size.innerWidth;
                var frameHeight = size.outerHeight - size.innerHeight;
                var updateInfo = {
                    width: newWidth + frameWidth,
                    height: newWidth * Constants.widget.aspect + frameHeight
                };
                chrome.windows.update(widgetWindow.id, updateInfo,function(){
                    //window.close();
                });
            }
        });
    });
    var divs = document.getElementsByClassName('select');
    for(var i= 0,len=divs.length; i<len; i++){
        divs[i].addEventListener('click',function(){
            uncheckAll();
            this.childNodes[1].checked = true;
        });
    }
    var resets = document.getElementsByClassName('reset-achievements');
    for(var i= 0,len=resets.length;i<len; i++){
        resets[i].addEventListener('click',function(){
            var achievements = new KanColleWidget.Achievements(new MyStorage());
            achievements.update(true, this.getAttribute('target'));
        });
    }

    if(Config.get('show-clockmode-button')){
        var clockmodeBtn = document.getElementById('show-clockmode-button');
        clockmodeBtn.addEventListener('click',function(){
            Util.openDashboard();
        });
    }else{
        var clockmodeBtn = document.getElementById('show-clockmode-button');
        clockmodeBtn.style.display = 'none';
    }

    affectTracking();
    prepareForScreenShot();

    if (Util.haveNewUpdate()) {
        $('#new-arrival').append("アップデート有り");
    }

    if (Config.get("display-maintenance-info")) {
        var staffTwitterView = new widgetPages.StaffTwitterView();
        $("div#main").append(staffTwitterView.render());
    }

    var timersView = new widgetPages.TimersView(true);
    $("#time-left-wrapper").append(// リファクタ後は、#main.appendしたい
        timersView.render()
    );

    if (Config.get('sync-save-type') > 0) {
        $('#sync-load').show();
        $('#sync-load').on('click',function(){
            MyStorage.sync.load(function(){
                window.close();
            });
        });
    }
})();
