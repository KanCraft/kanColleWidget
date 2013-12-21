var dummyDate = {
  getHours   : function() { return '--'; },
  getMinutes : function() { return '--'; }
};
var KanColleWidget = KanColleWidget || {};
function updateTimeLeft(){
    var renderParams = [];
    var evMissions = new KanColleWidget.Missions();
    var missions = evMissions.getAll();
    missions.map(function(m){
        var d = new Date(m.finish);
        var style = '';
        var padding = "&nbsp;";//くそ
        if(m.finish == null) {
            d = dummyDate;
            style = "color:#bbb";
            padding = "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        renderParams.push({
            deck_id : String(m.deck_id),
            rawtime : d,
            style   : style,
            time    : Util.zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + Util.zP(2,String(d.getMinutes())) + padding
        });
    });
    renderMissions(renderParams);

    var renderParamsCreateships = [];
    var evCreateshiips = new KanColleWidget.Createships();
    var createships = evCreateshiips.getAll();
    createships.map(function(c){
        var d = new Date(c.finish);
        var style = '';
        var padding = "&nbsp;";//くそ
        if(c.finish == null){
            d = dummyDate;
            style = "color:#bbb";
            padding = "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        renderParamsCreateships.push({
            api_kdock_id : String(c.api_kdock_id),
            rawtime      : d,
            style        : style,
            time         : Util.zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + Util.zP(2,String(d.getMinutes())) + padding
        });
    });
    renderCreateships(renderParamsCreateships);

    var renderParamsNyukyos = [];
    var evNyukyos = new KanColleWidget.Nyukyos();
    var nyukyos = evNyukyos.getAll();
    nyukyos.map(function(n){
        var d = new Date(n.finish);
        var style = '';
        var padding = "&nbsp;";//くそ
        if(n.finish == null){
            d = dummyDate;
            style = "color:#bbb";
            padding = "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        renderParamsNyukyos.push({
            api_ndock_id : String(n.api_ndock_id),
            rawtime      : d,
            style        : style,
            time         : Util.zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + Util.zP(2,String(d.getMinutes())) + padding
        });
    });
    renderNyukyos(renderParamsNyukyos);
}

function renderMissions(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="deck{deck_id}"><a class="editor" target="mission" key="deck_id" data="{deck_id}">'
        + '<span style="{style}">{time}</span> 第{deck_id}艦隊</a></li>';
    var ul = document.getElementById('time-list-container');
    ul.innerHTML = '';
    // Missionsだけ、第一艦隊が無いので、デザインのためにつけたしちゃう
    ul.innerHTML += '<li id="deck1"><span style="color:#bbb">--:--&nbsp;&nbsp;&nbsp;&nbsp;</span> 第1艦隊</li>';
    params.map(function(p){
        var dom = template.replace(/\{deck_id\}/g, p.deck_id).replace('{time}', p.time).replace('{style}', p.style);
        ul.innerHTML += dom;
    });
    // 表示すべき任務リストが無いなら領域から消す
    //if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-missions'), false);
}
function renderCreateships(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="kdock{api_kdock_id}"><a class="editor" target="createship" key="api_kdock_id" data="{api_kdock_id}">'
        + '<span style="{style}">{time}</span> 第{api_kdock_id}建造d</a></li>';
    var ul = document.getElementById('time-list-container-createships');
    ul.innerHTML = '';
    params.map(function(p){
        var dom = template.replace(/\{api_kdock_id\}/g, p.api_kdock_id).replace('{time}', p.time).replace('{style}',p.style);
        ul.innerHTML += dom;
    });
    // 表示すべき建造リストが無いなら領域から消す
    //if(params.length == 0) _toggleArea(document.getElementById('time-list-wrapper-createships'), false);
}
function renderNyukyos(params){
    params = Util.sortReminderParamsByEndtime(params);
    var template = '<li id="ndock{api_ndock_id}"><a class="editor" target="nyukyo" key="api_ndock_id" data="{api_ndock_id}">'
        + '<span style="{style}">{time}</span> 第{api_ndock_id}入渠d</a></li>';
    var ul = document.getElementById('time-list-container-nyukyos');
    ul.innerHTML = '';
    params.map(function(p){
        var dom = template.replace(/\{api_ndock_id\}/g, p.api_ndock_id).replace('{time}', p.time).replace('{style}',p.style);
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
        var path = "src/html/set_manual_timer.html";
        var params = {};
        params[$(this).attr("key")] = $(this).attr("data");
        params['purpose'] = $(this).attr("target");
        Util.enterTimeManually(params, path);
    });
}

(function(){

    var timersView = new widgetPages.TimersView();
    $("#page0").append(timersView.render());

    //var questListView = new widgetPages.QuestListView(quests.getAll().map);
    var questListView = new widgetPages.QuestListView(new KanColleWidget.Quests());
    $("div#quest-list-container").append(questListView.render()); 
    $("span#progress").text(questListView.getProgress());

    var memoView = new widgetPages.MemoView();
    $("div#recipe-memo-container").append(memoView.render());
    // {{{ おいおいーい
    $("textarea#recipe-memo").on("keyup",function(ev){
        memoView.saveRecipeMemo(ev);
    });
    // }}}

    if (Config.get('tiredness-recovery-minutes') == 0) $('#tiredness-contents').hide();

    var tirednessListView = new widgetPages.TirednessListView();
    $("div#tiredness-container").append(tirednessListView.render());

    var mainClockView = new widgetPages.MainClockView();
    $("div#main-clock").append(mainClockView.render());
    mainClockView.dateIconView.update(new Date());
    mainClockView.daysTimeView.update(new Date());
    setInterval(function(){mainClockView.ticktack();}, 1000);

    if (Config.get('clockmode-style') == 1) {//Tag Style
        var sideNaviView = new widgetPages.SideNaviView();
        $('#wrapper').append(sideNaviView.render());
        widgetPages.SideNaviView.adjustToSideNavi();
    }

    updateTimeLeft();
    bindEditor();
    var updating = setInterval(function(){
        updateTimeLeft();
        bindEditor();

        timersView.update();
        $("div#tiredness-container").html('').append(tirednessListView.render());
        if (! questListView.haveUpdate()) return;//アップデート無いならひっこんでな
        $("div#quest-list-container").html('').append(questListView.refresh());
        $("span#progress").text(questListView.getProgress());
    },5000);
})();
