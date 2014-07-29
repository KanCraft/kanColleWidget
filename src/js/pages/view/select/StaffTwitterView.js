var widgetPages = widgetPages || {};
(function() {
    var StaffTwitterView = widgetPages.StaffTwitterView = function() {
        this.modTwitter = KanColleWidget.TwitterCrawler;
        this.tpl = ''
        + '<div>'
        + '  <hr><h6>運営電文<span id="hit-count"></span></h6>'
        + '  <div id="staff-tweets-contents"></div>'
        + '  <div id="loader-wrapper" style="width:80px;margin: 0 auto;">'
        + '    <img id="ajax-loader" src="../img/ajax-loader.gif" style="display:none;width:100%;">'
        + '  </div>'
        + '</div>';
        this.events = {
        };
        this.attrs = {
            id : "staff-tweets"
        };
    };
    Util.extend(StaffTwitterView, widgetPages.View);
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
            $('span#hit-count').text('('+$e.length+'件)');
        });
    };
})();
