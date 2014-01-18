/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var FuckinChromeBugView = widgetPages.FuckinChromeBugView = function(){
        this.inputName = 'fuckin-chrome-bug';
        this.title = "Chrome32のWindowsにおける「ページ応答なし」ダイアログのバグを回避する";
        this.description = $('<span></span>');
        this.description.html('詳細は<a>ここ</a>を確認してください');
        this.description.find('a').attr({
            href : 'https://github.com/otiai10/kanColleWidget/issues/319'
        });
        this.description.addClass('description xsmall');
    };
    FuckinChromeBugView.prototype = Object.create(widgetPages.SettingCheckboxView.prototype);
    FuckinChromeBugView.prototype.constructor = FuckinChromeBugView;
})();
