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
    let text = [];
    const area = SortieContext.catalog[this.area] || SortieContext.catalog[0];
    text.push(area.name);
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
      iconUrl: "/dest/img/icons/chang.white.png",
      title: "艦隊被害状況",
      message: this.getNotificationMessage(),
      imageUrl: uri,
      requireInteraction: true,
    };
  }
}
SortieContext.catalog = {
  1: {
    name: "鎮守府海域",
    info: {
      1: "鎮守府正面海域"
    },
  },
  2: {
    name: "南西諸島海域",
    info: {
      2: "バシー島沖",
      3: "東部オリョール海"
    }
  },
  3: {
    name: "北方海域",
    info: {
    },
  },
  4: {
    name: "西方海域",
    info: {
    },
  },
  5: {
    name: "南方海域",
    info: {
    },
  },
  6: {
    name: "中部海域",
    info: {
    },
  },
  0: {
    name: "特別海域",
    info: {
    }
  },
};
