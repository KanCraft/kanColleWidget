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

var myStorage = new MyStorage();

function updateTimeLeft(){
    var renderParams = [];
    var missions = myStorage.get('missions') || [];
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
    var createships = myStorage.get('createships') || [];
    createships.map(function(c){
        if(c.finish == null) return;
        var d = new Date(c.finish);
        renderParamsCreateships.push({
            api_kdock_id : String(c.api_kdock_id),
            rawtime : d,
            time         : Util.zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + Util.zP(2,String(d.getMinutes()))
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
            rawtime : d,
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
    var template = '<li id="kdock{api_kdock_id}"><span id="time-left-createships-kdock{api_kdock_id}">{time}</span> <span class="kdock-id">第{api_kdock_id}建造ドック</span></li>';
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
    var template = '<li id="ndock{api_ndock_id}"><span id="time-left-nyukyos-ndock{api_ndock_id}">{time}</span> <span class="ndock-id">第{api_ndock_id}入渠ドック</span></li>';
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

(function(){
    updateNow();
    applyIconImg();
    updateTimeLeft();
    var clock = setInterval(function(){
        updateNow();
    },1000);
    var updating = setInterval(function(){
        updateTimeLeft();
    },5000);
})();
