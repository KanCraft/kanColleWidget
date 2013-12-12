var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    /**
     * localStorageに直接アクセスしていい唯一のクラス
     * @type {Function}
     */
    var MyStorage = KanColleWidget.MyStorage = function(){};
    /**
     * getItem
     * @param key
     * @returns {*}
     */
    MyStorage.prototype.get = function(key){

        if (sessionStorage.isTest == 'true') return MyStorage.ofTest().get(key);

        try{
            return JSON.parse(localStorage.getItem(key));
        }catch(e){
            return localStorage.getItem(key);
        }
    };
    /**
     * setItem
     * @param key
     * @param value
     * @returns {*}
     */
    MyStorage.prototype.set = function(key,value){

        if (sessionStorage.isTest == 'true') return MyStorage.ofTest().set(key,value);

        return localStorage.setItem(key,JSON.stringify(value));
    };
    /**
     * テスト用のインスタンスを返す
     * @returns {MyStorage}
     */
    MyStorage.ofTest = function(){
        var self = new MyStorage();
        self.isTest = true;
        sessionStorage.isTest = true;
        // overwrite basic methods
        self.get = function(key){
            try{
                return JSON.parse(sessionStorage.getItem(key));
            }catch(e){
                return sessionStorage.getItem(key);
            }
        };
        self.set = function(key, value){
            sessionStorage.setItem(key,JSON.stringify(value));
        };
        return self;
    };
    /**
     * テスト用のインスタンスをclearする
     * @returns {boolean}
     */
    MyStorage.prototype.tearDown = function(){
        if (this.isTest) {
            sessionStorage.clear();
            return true;
        }
        return false;
    };

    /**
     * localStorage.configにアクセスする
     * スタティックモジュール
     * @static
     */
    var Config = KanColleWidget.Config = {};
    Config.storage = new MyStorage();
    Config.initial = {
        'announce-already-read'              : 0,
        'badge-left-time'                    : true,
        'record-achievements'                : false,
        //'enable-manual-reminder'           : false, //Obsolete!!
        'enable-dynamic-reminder'            : false,
        'popup-select-title'                 : '',
        'notification-img-file'              : '',
        'notification-sound-file'            : '',
        'notification-sound-volume'          : '100',
        'notification-mission-end-suffix'    : '',
        'notification-nyukyo-end-suffix'     : '',
        'notification-createship-end-suffix' : '',
        //'enable-notification'              : false, // Obsolete!!
        'notification-on-reminder-set'       : true,
        'notification-on-reminder-finish'    : true,
        'notification-offset-millisec'       : 60*1000,//デフォルトでは1分前
        'enable-screen-shot'                 : false,
        'capture-destination-size'           : true, // とりあえず今はbool
        'capture-image-format'               : 'png',
        'launch-on-click-notification'       : false,
        'show-clockmode-button'              : true,
        'download-on-screenshot'             : false,
        'notification-stay-visible'          : '',
        'enable-mission-reminder'            : true,
        'dynamic-reminder-type'              : 0,
        'allow-ocr-result-log'               : false,
        'share-kousyo-result'                : false,
        'tiredness-recovery-minutes'         : 0,
        'prevent-forgetting-quest'           : false,
        'display-maintenance-info'           : false,
        'clockmode-style'                    : 0,
        'sort-by-finishtime'                 : false
    };
    /**
     * 後方互換を重視し、無いキーを参照されることを避ける
     * @returns {*}
     */
    Config.repair = function(){
        var config = this.storage.get('config') || this.initial;
        for(var key in this.initial){
            if(config[key] == null){
                config[key] = this.initial[key];
            }
        }
        this.storage.set('config', config);
        return config;
    };
    /**
     * JSONで全部返す
     * @returns {*}
     */
    Config.getJSON = function(){
        var config = this.repair() || this.initial;
        return config;
    };
    /**
     * dictを渡してまるっと置き換える
     * @param dict
     */
    Config.updateAll = function(dict){
        this.storage.set('config', dict);
    };
    /**
     * キー指定でvalueを取得
     * @param key
     * @returns {*}
     */
    Config.get = function(key){
        var config = this.getJSON();
        return config[key];
    };
    /**
     * キー指定でvalueを上書き
     * @param key
     * @param value
     * @returns {boolean}
     */
    Config.set = function(key,value){
        var config = this.getJSON();
        config[key] = value;
        this.storage.set('config', config);
        return true;
    };

    /**
     * localStorage.inputTrackingにアクセスする
     * スタティックモジュール
     * @static
     */
    var Tracking = KanColleWidget.Tracking = {};
    Tracking.storage = new MyStorage();
    Tracking.initial = {
        mode : 'm',
        widget : {
            position : {
                left : 50,
                top  : 50
            },
            size : {
                height: 0,
                width : 0
            }
        },
        createship : {
            hour   :  1,
            minute : 30
        },
        nyukyo : {
            hour   :  1,
            minute : 30
        }
    };
    /**
     * メソッドなど、だいたいConfigモジュールと同じ
     * @returns {*}
     */
    Tracking.repair = function(){
        var tracking = this.storage.get('inputTracking') || this.initial;
        for(var key in this.initial){
            if(!tracking[key]){
                tracking[key] = this.initial[key];
            }
        }
        this.storage.set('inputTracking', tracking);
        return tracking;
    };
    Tracking.getJSON = function(){
        var tracking = this.repair() || this.initial;
        for( var key in this.initial ){
            if( tracking[key] == undefined ){
                tracking[key] = this.initial[key];
            }
        }
        return tracking;
    };
    Tracking.updateAll = function(dict){
        this.storage.set('inputTracking', dict);
    };
    Tracking.get = function(key){
        var tracking = this.getJSON();
        return tracking[key];
    };
    Tracking.set = function(key,value){
        var tracking = this.getJSON();
        tracking[key] = value;
        this.storage.set('inputTracking', tracking);
        return true;
    };
})();
