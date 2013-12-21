(function(){
    "use strict";

    if (Config.get('tiredness-recovery-minutes') == 0) $('#tiredness-contents').hide();

    var timersView = new widgetPages.TimersView();
    var tirednessListView = new widgetPages.TirednessListView();
    var mainClockView = new widgetPages.MainClockView();
    $("#page0").append(
        mainClockView.render(),
        timersView.render(),
        tirednessListView.render()
    );
    setInterval(function(){
        mainClockView.update();
    }, 1000);

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


    if (Config.get('clockmode-style') == 1) {//Tab Style
        var sideNaviView = new widgetPages.SideNaviView();
        $('#wrapper').append(sideNaviView.render());
        widgetPages.SideNaviView.adjustToSideNavi();
    }

    setInterval(function(){

        timersView.update();
        tirednessListView.update();

        if (! questListView.haveUpdate()) return;//アップデート無いならひっこんでな
        $("div#quest-list-container").html('').append(questListView.refresh());
        $("span#progress").text(questListView.getProgress());
    },5000);
})();
