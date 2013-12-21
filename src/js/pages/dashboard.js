(function(){
    "use strict";

    if (Config.get('tiredness-recovery-minutes') == 0) $('#tiredness-contents').hide();

    var timersView = new widgetPages.TimersView();
    var tirednessListView = new widgetPages.TirednessListView();
    $("#page0").append(
        timersView.render(),
        tirednessListView.render()
    );

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

    var updating = setInterval(function(){

        timersView.update();
        tirednessListView.update();

        if (! questListView.haveUpdate()) return;//アップデート無いならひっこんでな
        $("div#quest-list-container").html('').append(questListView.refresh());
        $("span#progress").text(questListView.getProgress());
    },5000);
})();
