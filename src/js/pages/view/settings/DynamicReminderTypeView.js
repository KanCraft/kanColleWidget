/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var DynamicReminderTypeView = widgetPages.DynamicReminderTypeView = function(){
        this.inputName = 'dynamic-reminder-type';
        this.title = "入渠・建造時リマインダー登録を有効にする";
        this.elements = [
            {value:'0', title: '何もしない', description: '入渠・建造のリマインダは使わないよというひと'},
            {value:'1', title: '常に手動登録ウィンドウ出す', description: '自動取得失敗とかウザいよってひと'},
            {value:'2', title: '自動取得', description: '失敗したら手動登録ウィンドウが出ます'}
        ];
    };
    DynamicReminderTypeView.prototype = Object.create(widgetPages.SettingRadioButtonView.prototype);
    DynamicReminderTypeView.prototype.constructor = DynamicReminderTypeView;
})();
