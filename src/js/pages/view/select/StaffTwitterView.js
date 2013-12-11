var widgetPages = widgetPages || {};
(function() {
    var StaffTwitterView = widgetPages.StaffTwitterView = function() {
        this.modTwitter = KanColleWidget.TwitterCrawler;
        this.tpl = '<div><hr><small>運営メンテナンス情報</small><div id="staff-tweets-contents"></div></div>';
        this.events = {
        };
        this.attrs = {
            id : "staff-tweets"
        };
    };
    StaffTwitterView.prototype = Object.create(widgetPages.View.prototype);
    StaffTwitterView.prototype.constructor = StaffTwitterView;
    StaffTwitterView.prototype.render = function(){
        this.apply()._render();
        var self = this;
        setTimeout(function(){ self.addTweets(); }, 1000);
        return this.$el;
    };
    StaffTwitterView.prototype.addTweets = function(){
        this.modTwitter.get$(function($e){
            $('div#staff-tweets-contents').hide().append($e).fadeIn(30);
        });
    };
})();
