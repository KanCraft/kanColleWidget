// 出撃状態のコンテキストをオンメモリに保存するクラス
export default class SortieContext {

  constructor(module = chrome) {
    this.module = module;
    this.area = null; // 南西とか
    this.info = null; // オリョールとか
    this.battles = 0; // 第何戦目か
  }

  static _instance = null;
  static sharedInstance() {
    if (this._instance == null) {
      this._instance = new this();
    }
    return this._instance;
  }

  // 出撃作戦の開始時
  start(area, info) {
    this.area = area;
    this.info = info;
    this.battles = 0;
  }

  // 敵との戦闘開始時
  battle(sweep = true) {
    this.battles += 1;
    if (sweep) this.sweepsnapshot();
  }

  // 出撃作戦のなんらかの終了時ないし終了相当のタイミング
  clear() {
    this.constructor._instance = null;
  }

  // ノーティフィケーションつくる
  damagesnapshot(uri) {
    this.module.notifications.create(
      this.toNotificationID(),
      this.toNotificationParams(uri)
    );
  }

  // ノーティフィケーションを削除する
  sweepsnapshot() {
    this.module.notifications.clear(this.toNotificationID());
  }

  getNotificationMessage() {
    const area = SortieContext.catalog.areas[this.area] || {};
    let text = [area.title || "特別海域"];
    if (area.info[this.info]) text.push(area.info[this.info]);
    text.push(`第${this.battles}回戦闘終了時`);
    return text.join("、");
  }

  toNotificationID() {
    return "damagesnapshot";
  }

  toNotificationParams(uri) {
    return {
      type: "image",
      iconUrl: "/dest/img/icons/chang.white.png", // TODO: ここどうするかな
      title: "艦隊被害状況",
      message: this.getNotificationMessage(),
      imageUrl: uri,
      requireInteraction: true,
    };
  }

  toContextTitle() {
    const area = SortieContext.catalog.areas[this.area] || {info:{}};
    return [
      area.title || "E",
      area.info[this.info].operation || this.info,
      (this.battles) ? `${this.battles}戦目` : "出撃開始"
    ].join("/");
  }

}
SortieContext.catalog = require("./catalog.json");
