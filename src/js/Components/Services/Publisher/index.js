/**
 * 外部Chrome拡張にイベントペイロードを送りつけるマン
 */
export default class Publisher {
  constructor(subscribers, mod = chrome.runtime) {
    this.subscribers = subscribers || [];
    this.module      = mod;
  }
  static to(subscribers) {
    return new this(subscribers);
  }
  publish(queue) {
    const payload = this._queue2payload(queue);
    return Promise.all(this.subscribers.map(sub => {
      return new Promise(resolve => {
        this.module.sendMessage(sub.extID, payload);
        resolve(); // とりあえずレスポンスを期待しない
      });
    }));
  }
  _queue2payload(queue) {
    return {
      timestamp: Date.now(),// payloadが送信された時間
      event: {
        target: this._type2target(queue.params.type),
        type: "created",
        finish: queue.scheduled, // event.target(="mission")が終わる時間
        params: {
          format: this._message4type(queue.params.type),
          key: parseInt(queue.dock || queue.deck),// 遠征・疲労回復の場合は艦隊ID、それ以外の場合はドックIDになります
          label: this._label4type(queue.params.type),// イベントの短縮名
          unit: this._unit4type(queue.params.type),// 遠征・疲労回復の場合は"艦隊"、それ以外の場合は"ドック"になります
          optional: (queue.params.type == "mission" ? {
            missionId: queue.params.mission, // 手動で登録した場合など該当が無い場合は0になります
            title:     queue.params.title,
          } : {})
        }
      }
    };
  }
  /**
   * v1だと'nyukyo'なんだわ...
   * @return "mission" | "nyukyo" | "createship" | "tiredness"
   */
  _type2target(type) {
    switch(type) {
    case "recovery": return "nyukyo";
    default: return type;
    }
  }
  /**
   * これ使われてないきがするけどな
   */
  _message4type(type) {
    switch(type) {
    case "recovery":   return "第%dドックの修復が終了します。";
    case "createship": return "第%dドックの建造が終了します。";
    case "mission": default: return "第%d艦隊が遠征から帰投します。";
    }
  }
  // おなじく
  _label4type(type) {
    switch(type) {
    case "recovery":   return "修復完了";
    case "createship": return "建造完了";
    case "tiredness":  return "疲労回復";
    case "mission": default: return "遠征帰投";
    }
  }
  // おなじく
  _unit4type(type) {
    switch(type) {
    case "mission":
    case "tiredness": return "艦隊";
    default: return "ドック";
    }
  }
}
