
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
        var announcements = [Constants.release.version];
        announcements = announcements.concat(Constants.release.announcements);
        for (var i in announcements) {
            htmlstr += '<li>' + announcements[i] + '</li>';
        };
        this.$el.find('ul').append(htmlstr);
        return this.$el;
    };
    AnnounceView.prototype.doneAnnounce = function(ev, self){
        self.config.set("announce-already-read", Constants.release.announceVersion);
        $("#announce").hide();
    };
})();
