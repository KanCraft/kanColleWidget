function updateNow(){
    var d = new Date();
    var month  = Util.zP(2, d.getMonth() + 1);
    var date   = Util.zP(2, d.getDate());
    var day    = d.getDay();
    var hour   = Util.zP(2, d.getHours());
    var minute = Util.zP(2, d.getMinutes());
    var seconds= Util.zP(2, d.getSeconds());
    document.getElementById('month').innerHTML = month;
    document.getElementById('date').innerHTML = date;
    document.getElementById('hour').innerHTML = hour;
    document.getElementById('minute').innerHTML = minute;
    document.getElementById('seconds').innerHTML = seconds;

    if(parseInt(hour) == 0 || parseInt(minute) == 0){
        // clear all
        var days = document.getElementsByClassName('days');
        for(var i=0,len=days.length;i<len;i++){
            days[i].style.fontWeight = 'normal';
        }
    }
    // bold target
    document.getElementById('day' + day).style.fontWeight = 'bold';
}
function applyIconImg(){
    if(!Config.get('notification-img-file')) return;
    document.getElementById('seconds-wrapper').style.backgroundImage = 'url("' + Config.get('notification-img-file') + '")';
}

var dummyDate = {
  getHours   : function() { return "--"; },
  getMinutes : function() { return "--"; }
};

function updateTimeLeft(){
    var renderParams = [];
    var evMissions = new Missions();
    var missions = evMissions.getAll();
    missions.map(function(m){
        if(m.finish == null) return;
        var d = new Date(m.finish);
        renderParams.push({
            deck_id : String(m.deck_id),
            rawtime : d,
            time    : Util.zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + Util.zP(2,String(d.getMinutes()))
        });
    });
    renderMissions(renderParams);

    var renderParamsCreateships = [];
    var evCreateshiips = new Createships();
    var createships = evCreateshiips.getAll();
    createships.map(function(c){
        var d = new Date(c.finish);
        if(c.finish == null) d = dummyDate;
        renderParamsCreateships.push({
            api_kdock_id : String(c.api_kdock_id),
            rawtime      : d,
            time         : Util.zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + Util.zP(2,String(d.getMinutes()))
        });
    });
    renderCreateships(renderParamsCreateships);

    var renderParamsNyukyos = [];
    var evNyukyos = new Nyukyos();
    var nyukyos = evNyukyos.getAll();
    nyukyos.map(function(n){
        var d = new Date(n.finish);
        if(n.finish == null) d = dummyDate;
        renderParamsNyukyos.push({
            api_ndock_id : String(n.api_ndock_id),
            rawtime      : d,
            time         : Util.zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + Util.zP(2,String(d.getMinutes()))
        });
    });
    renderNyukyos(renderParamsNyukyos);
}

function renderMissions(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="deck{deck_id}"><span id="time-left-deck2">{time}</span> <span class="deck-id">第{deck_id}艦隊</span></li>';
    var ul = document.getElementById('time-list-container');
    ul.innerHTML = '';
    params.map(function(p){
        var dom = template.replace(/\{deck_id\}/g, p.deck_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    // 表示すべき任務リストが無いなら領域から消す
    //if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-missions'), false);
}
function renderCreateships(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="kdock{api_kdock_id}"><a class="editor" target="createship" key="api_kdock_id" data="{api_kdock_id}">{time} 第{api_kdock_id}建造ドック</a></li>';
    var ul = document.getElementById('time-list-container-createships');
    ul.innerHTML = '';
    params.map(function(p){
        var dom = template.replace(/\{api_kdock_id\}/g, p.api_kdock_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    // 表示すべき建造リストが無いなら領域から消す
    //if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-createships'), false);
}
function renderNyukyos(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="ndock{api_ndock_id}"><a class="editor" target="nyukyo" key="api_ndock_id" data="{api_ndock_id}">{time} 第{api_ndock_id}入渠ドック</a></li>';
    var ul = document.getElementById('time-list-container-nyukyos');
    ul.innerHTML = '';
    params.map(function(p){
        var dom = template.replace(/\{api_ndock_id\}/g, p.api_ndock_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    // 表示すべき建造リストが無いなら領域から消す
    //if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-nyukyos'), false);
}
function _toggleArea(e, sw){
    if(sw == true){
        e.style.display = '';
    }
    if(sw == false){
        e.style.display = 'none';
    }
}

function bindEditor() {
    $('a.editor').on('click',function(){
        var path = "src/html/set_" + $(this).attr("target") + ".html";
        var params = {};
        params[$(this).attr("key")] = $(this).attr("data");
        Util.enterTimeManually(params,path);
    });
}

(function(){
    updateNow();
    applyIconImg();
    updateTimeLeft();
    bindEditor();
    var clock = setInterval(function(){
        updateNow();
    },1000);
    var updating = setInterval(function(){
        updateTimeLeft();
        bindEditor();
    },5000);
})();
