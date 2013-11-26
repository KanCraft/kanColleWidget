
var widgetPages = widgetPages || {};

(function() {
    var AnnounceView = widgetPages.AnnounceView = function(config) {
        this.config = config;
        this.tpl = '<div class="boxy" id="announce-wrapper">'
                  +'    <div id="announce-img"><img src="../img/kagasan.png"></div>'
                  +'    <div id="announce-txt">'
                  +'        <div id="announce-contents"><h5>おしらせ</h5><ul></ul></div>'
                  +'        <div id="announce-button"><span id="announce-done" class="clickable">[おk]</span></div>'
                  +'    </div>'
                  +'</div>';
        this.events = {
            "click #announce-done" : "doneAnnounce"
        };
    };
    AnnounceView.prototype = Object.create(widgetPages.View.prototype);
    AnnounceView.prototype.constructor = AnnounceView;
    AnnounceView.prototype.render = function() {
        this.apply()._render();
        var htmlstr = '';
        for (var i in AnnounceView.announcements) {
            htmlstr += '<li>' + AnnounceView.announcements[i] + '</li>';
        };
        this.$el.find('ul').append(htmlstr);
        return this.$el;
    };
    AnnounceView.prototype.doneAnnounce = function(ev, self){
        self.config.set("announce-already-read", AnnounceView.version);
        $("#announce").hide();
    };
    // ここを変える
    AnnounceView.version = 2;
    AnnounceView.announcements = [
        "★ v0.5.1.1",
        "簡易疲労度メーターと回復通知",
        "スクショ撮った画面でファイル名変えるUIの追加",
        "自動取得失敗時に何もしない設定の追加",
        "ウィークリー任務実績値の謎の月曜日問題修正",
        "設定画面のバグ修正"
    ];
})();
