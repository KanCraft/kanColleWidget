/***** class definitions *****/

function MyStorage(){/** localStorageにアクセスするクラス **/}

MyStorage.prototype.get = function(key){
    try{
        return JSON.parse(localStorage.getItem(key));
    }catch(e){
        return localStorage.getItem(key);
    }
}

MyStorage.prototype.set = function(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}