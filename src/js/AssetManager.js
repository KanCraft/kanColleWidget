/* jshint indent: 4 */

var kanColleWidget = kanColleWidget || {};

(function() {
    'use strict';

    /**
     * アイコン、サウンドなどのアセットを管理するクラス
     * @param chrome {Object}
     * @param config {Object} src/js/definitions/models/MyStorage.js
     * @param constants {Object} src/js/Constants.js
     */
    var AssetManager = kanColleWidget.AssetManager = function(chrome,
                                                              config,
                                                              constants) {
        this.chrome    = chrome;
        this.config    = config;
        this.constants = constants;

        // 通知の種類
        this.notificationKinds = [
            'docking-start',      // 入渠した
            'docking-finish',     // 修理オワタ
            'expedition-start',   // 遠征行った
            'expedition-finish',  // 戻ってきたぞ
            'construction-start', // 建造開始
            'construction-finish' // ﾅｶﾁｬﾝﾀﾞﾖｰ
        ];
    };

    /**
     * 通知に使用するアイコンのURLを取得する
     * 特に設定していない場合は、猫を返す
     * @param kind {String} 種類: 'docking' or 'expedition' or 'construction' or undefined
     * @return {String} icon URL or cat.
     */
    AssetManager.prototype.getNotificationIconUrl = function(kind) {
        var key = 'notification-img-file';
        
        if(this.notificationKinds.indexOf(kind) >= 0) {
            key += '-' + kind;
        }

        var iconUrl = this.config.get(key);
        if(!iconUrl) {
            iconUrl = this.chrome.extension.getURL(this.constants.notification.img);
        }
        
        return iconUrl;
    };

    /**
     * 通知に使用するサウンドのURLを取得する
     * 遠征/入渠/建造は設定してあればそれを使用、なければデフォルトを使用する
     * @param kind {String} 種類: 'docking' or 'expedition' or 'construction' or undefined
     * @return {String} audio URL or cat.
     */
    AssetManager.prototype.getNotificationSoundUrl = function(kind) {
        var forDefault = 'notification-sound-file';
        var forKinds   = forDefault;

        if(this.notificationKinds.indexOf(kind) >= 0) {
            forKinds += '-' + kind;
        }
        
        var soundUrlForDefault = this.config.get(forDefault);
        var soundUrlForKinds   = this.config.get(forKinds);
        
        return soundUrlForKinds || soundUrlForDefault;
    };
})();
