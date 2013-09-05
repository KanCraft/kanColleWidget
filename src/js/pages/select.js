var myStorage = new MyStorage();

function updateTimeLeft(){
    var renderParams = [];
    var missions = myStorage.get('missions') || [];
    missions.map(function(m){
        if(m.finish == null) return;
        var d = new Date(m.finish);
        renderParams.push({
            deck_id : String(m.deck_id),
            time    : zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + zP(2,String(d.getMinutes()))
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
            time         : zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + zP(2,String(d.getMinutes()))
        });
    });
    renderCreateships(renderParamsCreateships);
}

function renderMissions(params){
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
    var template = '<li id="kdock{api_kdock_id}"><span id="time-left-createships-kdock{api_kdock_id}">{time}</span> <span class="kdock-id">第{api_kdock_id}建造ドック</span></li>';
    var ul = document.getElementById('time-list-container-createships');
    params.map(function(p){
        var dom = template.replace(/\{api_kdock_id\}/g, p.api_kdock_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    // 表示すべき建造リストが無いなら領域から消す
    if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-createships'), false);
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
    var config = myStorage.get('config');
    if(!config|| !config['record-achievements']) return toggleAchievementsArea(false);
    var achievements = new Achievements();
    var achievements_json = achievements.update().toJson();
    for(var key in achievements_json.daily.contents){
        var html = '<li class="'+key+' small">' + map_key_lang[key] + ' : ' + achievements_json.daily.contents[key] + '</li>';
        document.getElementById('achievements-daily').innerHTML += html;
    }
    for(var key in achievements_json.weekly.contents){
        var html = '<li class="'+key+' small">' + map_key_lang[key] + ' : ' + achievements_json.weekly.contents[key] + '</li>';
        document.getElementById('achievements-weekly').innerHTML += html;
    }
}

var map_key_lang = {
    'mission_count'  : '遠征',
    'map_count'      : '出撃',
    'hokyu_count'    : '補給',
    'kaisou_count'   : '近改',
    'practice_count' : '演習'
};

(function(){
    updateTimeLeft();
    updateAchievements();
    var aspect = 0.6;
    var conf_list = {"l": 1200,"m": 800,"s": 600,"xs": 400};
    document.forms[0].elements['launch'].addEventListener('click', function(){
        ifThereIsAlreadyKCWidgetWindow(function(){
            focusKCWidgetWindow();
            window.close();
        },function(){
            var mode = document.forms[0].elements['mode'].value;
            var w = conf_list[mode];
            var options = "width={w},height={h},menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40".replace('{w}', w).replace('{h}', String(w * aspect));
            var kanColleUrl = 'https://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/?mode='+mode;
            window.open(kanColleUrl,"_blank_new", options)
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
})();