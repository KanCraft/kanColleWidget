
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
        var announcements = [
            "v0.5.0.12で遠征リマインダ登録の不具合が起きました",
            "ウィジェット外で機能を無効にする修正を加えたことに起因します",
            "ウィジェット外でも遠征リマインダのみ有効にいたしました",
            "お詫び申し上げます"
        ];
        var htmlstr = '';
        for (var i in announcements) {
            htmlstr += '<li>' + announcements[i] + '</li>';
        };
        this.$el.find('ul').append(htmlstr);
        return this.$el;
    }
    AnnounceView.prototype.doneAnnounce = function(ev, self){
        self.config.set("announce-already-read", self.config.get("announce-version"));
        $("#announce").hide();
    }
})();
