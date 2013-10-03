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
            'nyukyo-start',      // 入渠した
            'nyukyo-finish',     // 修理オワタ
            'mission-start',     // 遠征行った
            'mission-finish',    // 戻ってきたぞ
            'createship-start',  // 建造開始
            'createship-finish'  // ﾅｶﾁｬﾝﾀﾞﾖｰ
        ];
    };

    /**
     * 通知に使用するアイコンのURLを取得する
     * 特に設定していない場合は、猫を返す
     * @param kind {String} 種類: 'nyukyo' or 'mission' or 'createship' or undefined
     * @return {String} icon URL or cat.
     */
    AssetManager.prototype.getNotificationIconUrl = function(kind) {
        var forDefault = 'notification-img-file';
        var forKinds   = 'notification-img-';
        
        if(this.notificationKinds.indexOf(kind) >= 0) {
            forKinds += kind + '-file';
        }

        var iconUrl = this.config.get(forKinds);
        
        if(!iconUrl) {
            iconUrl = this.config.get(forDefault);
        }
        
        if(!iconUrl) {
            iconUrl = this.chrome.extension.getURL(this.constants.notification.img);
        }
        
        return iconUrl;
    };

    /**
     * 通知に使用するサウンドのURLを取得する
     * 遠征/入渠/建造は設定してあればそれを使用、なければデフォルトを使用する
     * @param kind {String} 種類: 'nyukyo' or 'mission' or 'createship' or undefined
     * @return {String} audio URL or cat.
     */
    AssetManager.prototype.getNotificationSoundUrl = function(kind) {
        var forDefault = 'notification-sound-file';
        var forKinds   = 'notification-sound';

        if(this.notificationKinds.indexOf(kind) >= 0) {
            forKinds += '-' + kind + '-file';
        }
        
        var soundUrl = this.config.get(forKinds);

        if(!soundUrl) {
            soundUrl = this.config.get(forDefault);
        }
        
        return soundUrl;
    };
})();
