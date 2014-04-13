// Comment Style is JSDuck

var KanColleWidget = KanColleWidget || {};

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
    var Notifier = KanColleWidget.Notifier = function(window,
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

        this.showParameters = {
            kind: null,
            sound: null,
            title: null,
            body: null,
            icon: null,
            stay: true,
            onCompleted: function(){},
            onClicked: function(){}
        };

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

        this.showParameters.onCompleted = options.callback || function(){};

        // 通知の種類 'nyukyo' or 'mission' or 'createship' or undefined
        var kind = options.sound && options.sound.kind;
        this.showParameters.kind = kind;

        this.showParameters.icon = options.iconUrl || this.assetManager.getNotificationIconUrl(kind);

        this.showParameters.title = this.constants.notification.title;

        // FIXME : http://productforums.google.com/forum/#!mydiscussions/chrome-ja/sqN8dN337Dg
        this.showParameters.body = " " + message.split("\n").join("\n ");

        this.showParameters.onClicked = this.ensureClickedCallback(options.isPaymentRequired);

        this.showParameters.stay = this.ensureStayingOption(options.startOrFinish);

        this.showParameters.sound = options.sound;

        this._execute();
    };

    /**
     * 音声の再生。一度再生したものはキャッシュする
     * @param {Boolean} force true で強制リロード
     */
    Notifier.prototype.playSound = function() {
        var kind = this.showParameters.kind || 'default';
        var audio = this.showParameters.sound.force ? null : this.sounds[kind];

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

    Notifier.prototype.ensureClickedCallback = function(isPaymentRequired) {
        var onClicked = function(){};
        // 通知をクリックしたら起動するオプション
        if(this.config.get('launch-on-click-notification')) {
            var self = this;
            onClicked = function() {
                self.util.focusOrLaunchIfNotExists(self.tracking.get('mode'));
            };
        }
        // 課金系のやつ
        if(isPaymentRequired){
            var self = this;
            onClicked = function() {
                if (window.confirm("ウィジェットを閉めてdmmページを開きますか？")) {
                    self.util.closeWidgetWindow(function(){
                        self.util.openOriginalWindow();
                    });
                }
            };
        }
        return onClicked;
    };
    Notifier.prototype.ensureStayingOption = function(startOrFinish) {
        var isStay = this.config.get('notification-stay-visible');
        if(typeof isStay !== 'string') {
            isStay = isStay ? 'start-finish' : '';
            this.config.set('notification-stay-visible', isStay);
        }
        if(isStay == null || isStay.indexOf(startOrFinish) === -1) return false;
        return true;
    };

    Notifier.prototype._execute = function(){
        if (this.util.system.getChromeVersion() < 28) return this._executeByAlert();
        if (this.window.webkitNotifications) return this._executeWithPrefix();
        return this._executeDefault();
    };
    Notifier.prototype._executeByAlert = function() {
        this.window.alert(this.showParameters.body);
        this.showParameters.onCompleted();
    };
    Notifier.prototype._executeWithPrefix = function() {
        var notification = this.window.webkitNotifications.createNotification(
            this.showParameters.icon,
            this.showParameters.title,
            this.showParameters.body
        );
        notification.show();
        if (this.showParameters.stay === false) {
            this.window.setTimeout(function() {
                notification.cancel();
            }, 5000);
        }
        if(this.showParameters.sound) {
            this.playSound();
        }
        notification.onclick = this.showParameters.onClicked;
        this.showParameters.onCompleted();
    };
    Notifier.prototype._executeDefault = function() {
        var notification = new this.window.Notification(
            this.showParameters.title,
            {
                body: this.showParameters.body,
                icon: this.showParameters.icon
            }
        );
        if (this.showParameters.stay === false) {
            this.window.setTimeout(function() {
                notification.close();
            }, 5000);
        }
        if (this.showParameters.sound) {
            this.playSound();
        }
        notification.onclick = this.showParameters.onClicked;
        this.showParameters.onCompleted();
    };
})();
