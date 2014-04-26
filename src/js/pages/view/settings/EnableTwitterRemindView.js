/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var EnableTwitterRemindView = widgetPages.EnableTwitterRemindView = function(){
        this.inputName = 'enable-twitter-remind';
        this.title = "タイマーのTwitter通知";
        this.description = 'Twitterで'
        + '<a href="https://twitter.com/KanColleWidget" target="_blank">botちゃん</a>'
        + 'がメンションで通知してくれるようになります。'
        + '（注意！上の「Twitter連携」にもチェックを入れないと有効になりません）';
    };
    Util.extend(EnableTwitterRemindView, widgetPages.SettingCheckboxView);
})();
