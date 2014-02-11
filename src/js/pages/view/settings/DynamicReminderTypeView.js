/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var DynamicReminderTypeView = widgetPages.DynamicReminderTypeView = function(){
        this.inputName = 'dynamic-reminder-type';
        this.title = "入渠・建造時完了通知を使う";
        this.elements = [
            {value:'0', title: '使わない', description: '入渠・建造のリマインダは使わないよというひと'},
            {value:'1', title: '常に手動登録ウィンドウ出す', description: '自動取得失敗とかウザいよってひと'},
            {value:'3', title: '自動取得するけど', description: '失敗しても手動登録ウィンドウ出さない'},
            {value:'2', title: '自動取得', description: '失敗したら手動登録ウィンドウが出ます'}
        ];
    };
    Util.extend(DynamicReminderTypeView, widgetPages.SettingRadioButtonView);
})();
