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
        'popup-select-title'     : null
    },

    /* public: dict */getJSON : function(){
        return this.storage.get('config') || this.initial;
    },
    /* public: bool */updateAll : function(dict){
        console.log('MyStorage',dict);
        this.storage.set('config', dict);
    },
    /* public: * */get : function(key){
        var config = this.storage.get('config') || this.initial;
        return config[key];
    },
    /* public: bool */set : function(key,value){
        var config = this.storage.get('config') || this.initial;
        if(typeof config[key] == 'undefined') return false;// throw new Error('cannot set on undefined');
        config[key] = value;
        this.storage.set('config', config);
        return true;
    }
}
