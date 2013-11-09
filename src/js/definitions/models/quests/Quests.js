/***** class definitions *****/
function Quests(){
    // localStorageにある"quests"にアクセスするクラス
}
Quests.prototype = Object.create(MyStorage.prototype);
Quests.prototype.constructor = Quests;
// static
Quests.state = {
  YET  : 0,
  NOW  : 1,  
  DONE : 2 
};

Quests.prototype.embark = function(questId){
  return this._updateStateById(questId, Quests.state.NOW);
};
Quests.prototype.done = function(questId){
  return this._updateStateById(questId, Quests.state.DONE);
};
Quests.prototype.cancel = function(questId){
  return this._updateStateById(questId, Quests.state.YET);
};
Quests.prototype._updateStateById = function(questId, newState){
    var quests = this.get("quests") || this.init();
    if ( ! quests.map[questId]) return this;
    quests.map[questId].state = newState;
    quests.lastUpdated = Date.now();
    this.set("quests", quests);
    return this;
};

Quests.prototype.haveUpdate = function(criteriaTime){
    var quests = this.get("quests") || this.init();
    if (criteriaTime < quests.lastUpdated) return true;
    return false;
};
Quests.prototype.getAll = function(){
    return this.get("quests") || this.init();
};

Quests.prototype.init = function(){
    var initialValue = this.initialValue;
    initialValue.lastUpdated = Date.now();
    this.set("quests", initialValue);
    return this.get("quests");
};
Quests.prototype.initialValue = {
    lastUpdated : 0,//Date.now(),prototype定義内でのDate.nowはインスタンス化された時点が入る
    map : {
        // initDailyとか今後やらなあかんっぽいよなぁ
        // TODO: デイリーかウィークリーか判別するアレ =>  (　ﾟ∀ﾟ)o彡° YAGNI！YAGNI！
        // デイリー
        201 : { title : "敵艦隊を撃破せよ！",             id : 201, state : Quests.state.YET},
        216 : { title : "敵艦隊主力を撃滅せよ！",         id : 216, state : Quests.state.YET},
        303 : { title : "「演習」で練度向上！",           id : 303, state : Quests.state.YET},
        402 : { title : "「遠征」を3回成功させよう！",    id : 402, state : Quests.state.YET},
        503 : { title : "艦隊大整備！",                   id : 503, state : Quests.state.YET},
        504 : { title : "艦隊酒保祭り！",                 id : 504, state : Quests.state.YET},
        605 : { title : "新装備「開発」指令",             id : 605, state : Quests.state.YET},
        606 : { title : "新造艦「建造」指令",             id : 606, state : Quests.state.YET},
        702 : { title : "艦の「近代化改修」を実施せよ！", id : 702, state : Quests.state.YET}
    }
};
