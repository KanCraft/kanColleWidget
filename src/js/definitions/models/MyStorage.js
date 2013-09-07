/***** class definitions *****/

function MyStorage(){/** localStorageにアクセスするクラス **/}

/* dict */MyStorage.prototype.get = function(key){
    try{
        return JSON.parse(localStorage.getItem(key));
    }catch(e){
        return localStorage.getItem(key);
    }
};

/* void (でいいのか？) */MyStorage.prototype.set = function(key,value){
    localStorage.setItem(key,JSON.stringify(value));
};

/* static */var Config = {/** localStorage.configにアクセスするstaticなクラス **/

    /* private */storage : new MyStorage(),
    /* private */initial : {
        'badge-left-time'        : false,
        'record-achievements'    : false,
        'enable-manual-reminder' : true,
        'enable-notification'    : true,
        'popup-select-title'     : '',
        'notification-img-url'   : '',
		'notification-sound'        : false,
		'notification-sound-url'    : '',
		'notification-sound-volume' : '100',
    },

    /* public: dict */getJSON : function(){
    	var config = this.storage.get('config') || this.initial;
    	for( var key in this.initial ){
    		if( config[key] == undefined ){
    			config[key] = this.initial[key];
    		}
    	}
    	return config;
    },
    /* public: bool */updateAll : function(dict){
        this.storage.set('config', dict);
    },
    /* public: * */get : function(key){
        var config = this.getJSON();
        return config[key];
    },
    /* public: bool */set : function(key,value){
        var config = this.getJSON();
        config[key] = value;
        this.storage.set('config', config);
        return true;
    }
};

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
    	var tracking = this.storage.get('inputTracking') || this.initial;
    	for( var key in this.initial ){
    		if( tracking[key] == undefined ){
    			tracking[key] = this.initial[key];
    		}
    	}
    	return tracking;
    },
    /* public: bool */updateAll : function(dict){
        this.storage.set('inputTracking', dict);
    },
    /* public: * */get : function(key){
        var tracking = this.getJSON();
        return tracking[key];
    },
    /* public: bool */set : function(key,value){
        var tracking = this.getJSON();
        tracking[key] = value;
        this.storage.set('inputTracking', tracking);
        return true;
    }
};
