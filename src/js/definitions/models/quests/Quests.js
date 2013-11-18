/***** class definitions *****/
function Quests(){
    // localStorageにある"quests"にアクセスするクラス
}
Quests.prototype = Object.create(MyStorage.prototype);
Quests.prototype.constructor = Quests;
// static
Quests.state = {
  YET  :   0,
  NOW  :   1,  
  DONE :   2,
  HIDDEN : 3
};
// 常にtrueを返す
Quests._true = function(){
    return true;
};
// 日付の一の位が3,7,0の時にtrueを返す
Quests._date370 = function(){
    var today = Util.getTodayOfKanColle();
    switch(today.getDate() % 10){
        case 0:
        case 3:
        case 7:
            return true;
    }
    return false;
};
// 日付の一の位が2,8の時にtrueを返す
Quests._date28 = function(){
    var today = Util.getTodayOfKanColle();
    switch(today.getDate() % 10){
        case 2:
        case 8:
            return true;
    }
    return false;
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
Quests.prototype.hide = function(questId){
  return this._updateStateById(questId, Quests.state.HIDDEN);
};
Quests.prototype._updateStateById = function(questId, newState){
    this._resetDailyIfOutdated();
    var quests = this.get("quests") || this.init();
    if ( ! quests.map[questId]) return this;
    quests.map[questId].state = newState;
    quests.lastUpdated = Date.now();
    this.set("quests", quests);
    return this;
};
Quests.prototype._resetDailyIfOutdated = function() {
    return this._resetOutdatedByKey("daily");
};
Quests.prototype._resetOutdatedByKey = function(key){
    var criteriaRestTime = Util.getDailyResetTimestamp();
    var quests = this.get("quests") || this.init();
    if (criteriaRestTime <  quests.lastUpdated) return false;
    quests = this.init();
    this.set("quests", quests);
    return true;
};
Quests.prototype.haveUpdate = function(criteriaTime){
    var quests = this.get("quests") || this.init();
    if (criteriaTime < quests.lastUpdated) return true;
    return false;
};
/**
 * 本日定義されている任務一覧を返す
 * 除外 : 条件付き任務の該当しないもの
 * @returns {*}
 */
Quests.prototype.getAll = function(){
    this._resetDailyIfOutdated();
    var withMeta = this.get("quests") || this.init();
    var all = withMeta.map;
    var actives = {};
    for (var i in all) {
        var q = all[i];
        // {{{ 後方互換保証
        if (! q.type) {
            actives[q.id] = q;
            continue;
        }
        // }}}
        if (Quests[q.type]()) {
            actives[q.id] = q;
        }
    }
    withMeta.map = actives;
    return withMeta;
};
/**
 * 着手可能、もしくは表示可能な任務を返す
 * 除外 : 前提が終わっていない依存性任務
 * @returns {{}}
 */
Quests.prototype.availables = function(){
    this._resetDailyIfOutdated();
    var all = this.getAll().map || this.init().map;
    var availables = {};
    for (var i in all) {
        var q = all[i];
        // 依存するものがなければavailablesである
        if (q.required == null) {
            availables[q.id] = q;
            continue;
        }
        // 依存する任務が終わっていればavailablesである
        if (Quests.state.NOW < all[q.required].state) {
            availables[q.id] = q;
            continue;
        }
        // 依存するものがあり、依存する任務が終わっていないならavailablesではない
    }
    return availables;
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
        // 出撃 計8
        201 : { title : "敵艦隊を撃破せよ！",             id : 201, required : null, state : Quests.state.YET, type : "_true" },
        216 : { title : "敵艦隊主力を撃滅せよ！",         id : 216, required : 201,  state : Quests.state.YET, type : "_true" },
        210 : { title : "敵艦隊を10回邀撃せよ！",         id : 210, required : 216,  state : Quests.state.YET, type : "_true" },
        211 : { title : "敵空母を3隻撃沈せよ",            id : 211, required : 201,  state : Quests.state.YET, type : "_date370" },
        212 : { title : "敵輸送船団を叩け！",             id : 212, required : 201,  state : Quests.state.YET, type : "_date28" },
        218 : { title : "敵補給艦を3隻撃沈せよ！",        id : 218, required : 216,  state : Quests.state.YET, type : "_true" },
        226 : { title : "南西諸島海域の制海権を握れ！",   id : 226, required : 218,  state : Quests.state.YET, type : "_true" },
        230 : { title : "敵潜水艦を制圧せよ！",           id : 230, required : 226,  state : Quests.state.YET, type : "_true" },
        // 演習 計2
        303 : { title : "「演習」で練度向上！",           id : 303, required : null, state : Quests.state.YET, type : "_true" },
        304 : { title : "「演習」で他提督を圧倒せよ！",   id : 304, required : 303,  state : Quests.state.YET, type : "_true" },
        // 遠征 計2
        402 : { title : "「遠征」を3回成功させよう！",    id : 402, required : null, state : Quests.state.YET, type : "_true" },
        403 : { title : "「遠征」を10回成功させよう！",   id : 403, required : 402,  state : Quests.state.YET, type : "_true" },
        // 補給・入渠 計2
        503 : { title : "艦隊大整備！",                   id : 503, required : null, state : Quests.state.YET, type : "_true" },
        504 : { title : "艦隊酒保祭り！",                 id : 504, required : 503,  state : Quests.state.YET, type : "_true" },
        // 工廠 計5
        605 : { title : "新装備「開発」指令",             id : 605, required : null, state : Quests.state.YET, type : "_true" },
        606 : { title : "新造艦「建造」指令",             id : 606, required : 605,  state : Quests.state.YET, type : "_true" },
        607 : { title : "装備「開発」集中強化！",         id : 607, required : 606,  state : Quests.state.YET, type : "_true" },
        608 : { title : "艦娘「建造」艦隊強化！",         id : 608, required : 607,  state : Quests.state.YET, type : "_true" },
        609 : { title : "軍縮条約対応！",                 id : 609, required : 608,  state : Quests.state.YET, type : "_true" },
        // 改装 計1
        702 : { title : "艦の「近代化改修」を実施せよ！", id : 702, required : null, state : Quests.state.YET, type : "_true" }

        // 合計 20
    }
};
