/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var TweetHashtagView = widgetPages.TweetHashtagView = function(){
        this.inputName = 'tweet-hashtag';
        this.title = "ハッシュタグ";
        this.description = 'スクショTwitter連携したときにハッシュタグを付けます';
        this.placeholder = 'ex) #艦これ'
    };
    Util.extend(TweetHashtagView, widgetPages.SettingTextView);
    TweetHashtagView.prototype.validate = function(val){
        return true;
    };
})();
