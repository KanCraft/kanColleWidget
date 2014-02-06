/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var TirednessLengthView = widgetPages.TirednessLengthView = function(){
        this.inputName = 'tiredness-recovery-minutes';
        this.title = "簡易疲労度回復通知設定";
        this.description = '最後の出撃から何分で計算しているので正確ではないです';
        this.elements = [
            {value:'0', title: '使わない'},
            {value:'5', title: '疲労なんて5分でいい'},
            {value:'10', title: '10分で全快'},
            {value:'15', title: '15分休ませてあげる'}
        ];
    };
    Util.extend(TirednessLengthView, widgetPages.SettingSelectView);
})();
