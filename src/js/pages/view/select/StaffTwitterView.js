var widgetPages = widgetPages || {};
(function() {
    var StaffTwitterView = widgetPages.StaffTwitterView = function() {
        this.modTwitter = KanColleWidget.TwitterCrawler;
        this.tpl = ''
        + '<div>'
        + '  <hr><h6>運営メンテナンス情報<span id="hit-count"></span></h6>'
        + '  <div id="staff-tweets-contents"></div>'
        + '  <img id="ajax-loader" src="../img/ajax-loader.gif" style="display:none;width:100%">'
        + '</div>';
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
        this.addTweets();
        return this.$el;
    };
    StaffTwitterView.prototype.addTweets = function(){
        this.$el.find('#ajax-loader').show();
        var self = this;
        this.modTwitter.get$(function($e){
            self.$el.find('#ajax-loader').hide();
            $('div#staff-tweets-contents').hide().append($e).fadeIn(30);
            $('span#hit-count').text('(ヒット'+$e.length+'件)');
        });
    };
})();
