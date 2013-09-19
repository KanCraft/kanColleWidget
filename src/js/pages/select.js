var myStorage = new MyStorage();

function updateTimeLeft(){
    var renderParams = [];
    var missions = myStorage.get('missions') || [];
    missions.map(function(m){
        if(m.finish == null) return;
        var d = new Date(m.finish);
        renderParams.push({
            deck_id : String(m.deck_id),
            time    : zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + zP(2,String(d.getMinutes())),
            rawtime      : d
        });
    });
    renderMissions(renderParams);

    var renderParamsCreateships = [];
    var createships = myStorage.get('createships') || [];
    createships.map(function(c){
        if(c.finish == null) return;
        var d = new Date(c.finish);
        renderParamsCreateships.push({
            api_kdock_id : String(c.api_kdock_id),
            time         : zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + zP(2,String(d.getMinutes())),
            rawtime      : d
        });
    });
    renderCreateships(renderParamsCreateships);

    var renderParamsNyukyos = [];
    var nyukyos = myStorage.get('nyukyos') || [];
    nyukyos.map(function(n){
        if(n.finish == null) return;
        var d = new Date(n.finish);
        renderParamsNyukyos.push({
            api_ndock_id : String(n.api_ndock_id),
            time         : zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + zP(2,String(d.getMinutes())),
            rawtime      : d
        });
    });
    renderNyukyos(renderParamsNyukyos);
}

function renderMissions(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="deck{deck_id}"><span id="time-left-deck2">{time}</span> <span class="deck-id">第{deck_id}艦隊</span></li>';
    var ul = document.getElementById('time-list-container');
    params.map(function(p){
        var dom = template.replace(/\{deck_id\}/g, p.deck_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    // 表示すべき任務リストが無いなら領域から消す
    if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-missions'), false);
}
function renderCreateships(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="kdock{api_kdock_id}"><span id="time-left-createships-kdock{api_kdock_id}">{time}</span> <span class="kdock-id">第{api_kdock_id}建造ドック</span></li>';
    var ul = document.getElementById('time-list-container-createships');
    params.map(function(p){
        var dom = template.replace(/\{api_kdock_id\}/g, p.api_kdock_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    // 表示すべき建造リストが無いなら領域から消す
    if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-createships'), false);
}
function renderNyukyos(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="ndock{api_ndock_id}"><span id="time-left-nyukyos-ndock{api_ndock_id}">{time}</span> <span class="ndock-id">第{api_ndock_id}入渠ドック</span></li>';
    var ul = document.getElementById('time-list-container-nyukyos');
    params.map(function(p){
        var dom = template.replace(/\{api_ndock_id\}/g, p.api_ndock_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    // 表示すべき建造リストが無いなら領域から消す
    if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-nyukyos'), false);
}

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

    var achievements = new Achievements();
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

(function(){
    updateTimeLeft();
    updateAchievements();
    changeTitle();
    var this_select_window = window;
    document.forms[0].elements['launch'].addEventListener('click', function(){
        var mode = document.forms[0].elements['mode'].value;
        Tracking.set('mode',mode);
        Util.focusOrLaunchIfNotExists(mode, function(){
            // とりあえず全部closeしてみる
            this_select_window.close();
        });
    });
	//スクリーンショット
    document.forms[0].elements['screen-shot'].addEventListener('click', function(){
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            chrome.runtime.sendMessage({winId: widgetWindow.id});
            window.close();
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
            var achievements = new Achievements();
            achievements.update(true, this.getAttribute('target'));
        });
    }

    if(Config.get('show-clockmode-button')){
        var clockmodeBtn = document.getElementById('show-clockmode-button');
        clockmodeBtn.addEventListener('click',function(){
            // {{{ TODO: Utilへ移動
            var options = "width=420,height=240,location=no,toolbar=no,menubar=no,status=no,scrollbars=no,resizable=no,left=200,top=200";
            var dashboardWindow = window.open(chrome.extension.getURL('/') + 'src/html/dashboard.html', "_blank", options);
            // }}} TODO
        });
    }else{
        var clockmodeBtn = document.getElementById('show-clockmode-button');
        clockmodeBtn.style.display = 'none';
    }

    affectTracking();
    prepareForScreenShot();
})();
