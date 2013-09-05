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

    /* public: dict */get : function(key){
        var config = this.storage.get('config');
        if(typeof config[key] == 'undefined') return;
        return config[key];
    },
    /* public: bool */set : function(key,value){
        var config = this.storage.get('config');
        if(typeof config[key] == 'undefined') return false;// throw new Error('cannot set on undefined');
        config[key] = value;
        this.storage.set('config', config);
        return true;
    }
}
