/* jshint indent: 4 */

var widgetPages = widgetPages || {};

(function() {
    'use strict';

    var HideAdressbarInSafemodeView = widgetPages.HideAdressbarInSafemodeView = function(){
        this.inputName = 'hide-adressbar-in-safemode';
        this.title = "WHITEモードでアドレスバーを隠す";
        this.description = 'どうでもいいけどアドレスバーが見えてると「Chrome」見えてないと「専ブラ」と誤解する人がいるので、WHITEモードではあえて見せてます。スピリチュアルやね';
    };
    Util.extend(HideAdressbarInSafemodeView, widgetPages.SettingCheckboxView);
})();
