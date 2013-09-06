/***** class definitions *****/

function MyStorage(){/** localStorageにアクセスするクラス **/}

/* dict */MyStorage.prototype.get = function(key){
    try{
        return JSON.parse(localStorage.getItem(key));
    }catch(e){
        return localStorage.getItem(key);
    }
}

/* void (でいいのか？) */MyStorage.prototype.set = function(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}

/* static */var Config = {/** localStorage.configにアクセスするstaticなクラス **/

    /* private */storage : new MyStorage(),
    /* private */initial : {
        'badge-left-time'        : false,
        'record-achievements'    : false,
        'enable-manual-reminder' : true,
        'enable-notification'    : true,
        'popup-select-title'     : '',
        'notification-img-url'   : ''
    },

    /* public: dict */getJSON : function(){
        return this.storage.get('config') || this.initial;
    },
    /* public: bool */updateAll : function(dict){
        this.storage.set('config', dict);
    },
    /* public: * */get : function(key){
        var config = this.storage.get('config') || this.initial;
        return config[key];
    },
    /* public: bool */set : function(key,value){
        var config = this.storage.get('config') || this.initial;
        config[key] = value;
        this.storage.set('config', config);
        return true;
    }
}

/* static */var Tracking = {/** localStorage.inputTrackingにアクセスするstaticなクラス **/

    /* private */storage : new MyStorage(),
    /* private */initial : {
        mode : 'm',
        createship : {
            hour   :  1,
            minute : 30
        },
        nyukyo : {
            hour   :  1,
            minute : 30
        }
    },

    /* public: dict */getJSON : function(){
        return this.storage.get('inputTracking') || this.initial;
    },
    /* public: bool */updateAll : function(dict){
        this.storage.set('inputTracking', dict);
    },
    /* public: * */get : function(key){
        var tracking = this.storage.get('inputTracking') || this.initial;
        return tracking[key];
    },
    /* public: bool */set : function(key,value){
        var tracking = this.storage.get('inputTracking') || this.initial;
        tracking[key] = value;
        this.storage.set('inputTracking', tracking);
        return true;
    }
}