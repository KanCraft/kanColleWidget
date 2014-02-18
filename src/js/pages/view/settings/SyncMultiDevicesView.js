/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var SyncMultiDevicesView = widgetPages.SyncMultiDevicesView = function(){
        this.inputName = 'sync-multi-devices';
        this.title = "複数PCでウィジェットのデータを同期する";
        this.description = '複数窓って意味じゃないです<br><button id="sync-now">いますぐ同期する（別PCでチェック入れてる場合に有効）</button>';
    };
    Util.extend(SyncMultiDevicesView, widgetPages.SettingCheckboxView);
    SyncMultiDevicesView.prototype.syncNow = function(){
        var storage = new MyStorage();
        storage.sync.load(function(){
            storage.sync.save(function(){
                location.reload();
            });
        });
    };
})();
