/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var BadgeStyleView = widgetPages.BadgeStyleView = function(){
        this.inputName = 'badge-style';
        this.title = "バッジの表示形式";
        this.description = 'これです <a href="https://pbs.twimg.com/media/BTJoojqCMAAqFy3.png"><img src="https://pbs.twimg.com/media/BTNXZaCCIAADciW.png" width="30px"></a>';
        this.elements = [
            {value:'0', title: '何も表示しない'},
            {value:'1', title: '残り時間を通知タイプ別色付きで表示'},
            {value:'2', title: '残り時間を同色で'},
            {value:'3', title: '終了した件数を表示'}
        ];
    };
    Util.extend(BadgeStyleView, widgetPages.SettingSelectView);
})();
