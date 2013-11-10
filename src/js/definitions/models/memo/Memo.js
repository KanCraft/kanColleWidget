/***** class definitions *****/
function Memo(){/** localStorageにあるrecipememoにアクセスするクラス **/}

// extend
Memo.prototype = Object.create(MyStorage.prototype);
Memo.prototype.constructor = Memo;

Memo.prototype.toJson = function(){
    return this.get('recipememo') || this.initialValue;
};
Memo.prototype.save = function(value){
    var json = {value:value};
    return this.set('recipememo', json);
};
Memo.prototype.initialValue = {
  value : ""
};
