var KanColleWidget = KanColleWidget || {};
(function(){
    var Memo = KanColleWidget.Memo = function(){};
    // extend
    Memo.prototype = Object.create(KanColleWidget.MyStorage.prototype);
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
})();
