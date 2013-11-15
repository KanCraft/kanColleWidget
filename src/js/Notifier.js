// Comment Style is JSDuck

var kanColleWidget = kanColleWidget || {};

(function() {
    'use strict';

    /**
     * 通知周りの制御をする
     * @param {Object} win          ブラウザのウィンドウオブジェクト
     * @param {Object} assetManager src/js/assetmanager.js
     * @param {Object} config       src/js/definitions/models/MyStorage.js
     * @param {Object} constants    src/js/Constants.js
     * @param {Object} tracking     src/js/definitions/models/MyStorage.js
     * @param {Object} util         src/js/Util.js
     */
    var Notifier = kanColleWidget.Notifier = function(window,
                                                      assetManager,
                                                      config,
                                                      constants,
                                                      tracking,
                                                      util) {
        this.window        = window;
        this.assetManager  = assetManager;
        this.config        = config;
        this.constants     = constants;
        this.tracking      = tracking;
        this.util          = util;

        this.sounds = {};
    };

    /**
     * notificationを作ってイベントバインドしたうえでshowする
     * ここに来るときは既にnotificationすべきかどうかの判定が済んでいるものとする
     * Chromeのバージョンが古い場合は alert で代用する
     * @param {String} message Message
     * @param {Object} options
     */
    Notifier.prototype.giveNotice = function(message, options) {
        options = options || {};
        var callback = options.callback || function(){};

        // Chrome のデスクトップ通知が実装されたのは Ver28 から
        if(this.util.system.getChromeVersion() < 28) {
            alert(message);
            callback();
            return;
        }

        // 通知の種類 'nyukyo' or 'mission' or 'createship' or undefined
        var kind = options.sound && options.sound.kind;

        var icon  = options.iconUrl || this.assetManager.getNotificationIconUrl(kind);
        var title = this.constants.notification.title;

        var notification = this.window.webkitNotifications.createNotification(icon, title, message);

        // 通知をクリックしたら起動するオプション
        if(this.config.get('launch-on-click-notification')) {
            var self = this;
            notification.onclick = function() {
                self.util.focusOrLaunchIfNotExists(self.tracking.get('mode'));
            };
        }

        // 居座る判定
        (function(self) {
            var startOrFinish = options.startOrFinish;
            var isStay = self.config.get('notification-stay-visible');

            if(typeof isStay !== 'string') {
                isStay = isStay ? 'start-finish' : '';
                self.config.set('notification-stay-visible', isStay);
            }

            // 勝手に消えないオプションがオフなら、5秒後に消えるようにする
            if(isStay == null || isStay.indexOf(startOrFinish) === -1) {
                self.window.setTimeout(function() {
                    notification.cancel();
                }, 5000);
            }
        })(this);

        if(options.sound) {
            this.playSound(kind, options.sound.force);
        }
        notification.show();

        callback();
    };

    /**
     * 音声の再生。一度再生したものはキャッシュする
     * @param {String}  kind
     * @param {Boolean} force true で強制リロード
     */
    Notifier.prototype.playSound = function(kind, force) {
        kind = kind || 'default';
        var audio = force ? null : this.sounds[kind];

        if(audio == null) {
            var soundUrl = this.assetManager.getNotificationSoundUrl(kind);
            if(soundUrl == null) {
                return;
            }
            audio = new this.window.Audio(soundUrl);
            this.sounds[kind] = audio;
        }
        audio.volume = this.getSoundVolume();
        audio.play();
    };

    Notifier.prototype.getSoundVolume = function() {
        var volume = this.config.get('notification-sound-volume');
        volume = parseInt(volume) / 100;
        return volume;
    };
})();
