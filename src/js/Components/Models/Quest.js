import {Model} from "chomex";
import KanColleDate from "../Services/KanColleDate";

import {
  SORTIE,
  PRACTICE,
  MISSION,
  RECOVERY,
  SUPPLY,
  CREATEITEM,
  CREATESHIP,
  REMODEL,
  CUSTOMIZE,
  DESTROYSHIP,
} from "../../Constants";

export const YET    = 0;
export const NOW    = 1;
export const DONE   = 2;
export const HIDDEN = 3;

export const DAILY = "DAILY";

export default class Quest extends Model {
  static refreshIfUpdateNeeded() {
    const now = new KanColleDate();
    const last = this.find("lastTouched");
    if (!now.needsUpdateForDaily(last.timestamp)) return;
    this.drop();
    last.timestamp = Date.now();
    last.save();
  }
  static daily(all = true) {
    this.refreshIfUpdateNeeded();
    return Quest.filter(quest => {
      return quest.type == DAILY && (all ? true : quest.isAvailable());
    }).sort((prev, next) => {
      return (prev.id < next.id) ? -1 : 1;
    });
  }
    // 着手
  undertake() { return this._update(NOW); }
    // 中断
  cancel() { return this._update(YET); }
    // 達成
  done() { return this._update(DONE); }
    // 非表示
  hide() { return this._update(HIDDEN); }
  _update(state) {
    this.constructor.refreshIfUpdateNeeded();
    this.state = state;
    return this.save();
  }
  isAvailable() {
    if (this.ristrict) {
      // console.log(!this[this.ristrict]((new Date()).toJST()));
      if (!this[this.ristrict]((new Date()).toJST())) return false;
    }
    // FIXME: これもっとかっちょいい再帰にしたいな
    return this.required.map(id => Quest.find(id))
    .filter(quest => quest.state < DONE).length == 0;
  }

  // TODO: これ、たしかにJSTを渡してはいるんだけど、JSTということだけではなく、
  // TODO: KanColleDateを見なきゃいけないと思うんですよね
  _date28(d) {
    return d.getDate() == 2 || d.getDate() == 8;
  }
  _date370(d) {
    return d.getDate() == 3 || d.getDate() == 7 || d.getDate() == 0;
  }

  static alert(quests) {
    return [
      "quest-alert",
      {
        type:    "list",
        iconUrl: "./dest/img/icons/chang.white.png",
        title:   "未着手任務があります",
        message: "",
        items: quests.map(q => q._alertItem())
      }
    ];
  }
  _alertItem() {
    return {
      title: `${this.title}`,
      message: `${this._id}`,
    };
  }
}

Quest.default = {
  // ちょっとアレだけど、タイムスタンプ管理用のやつ
  "lastTouched": {type:"TIMESTAMP", timestamp: 0},
  // 出撃 計8
  201: {type: DAILY, trigger: SORTIE, title:"敵艦隊を撃破せよ！",             id: 201, required: [],     state: YET, restrict: "_date28"},
  216: {type: DAILY, trigger: SORTIE, title:"敵艦隊主力を撃滅せよ！",         id: 216, required: [201],  state: YET},
  211: {type: DAILY, trigger: SORTIE, title:"敵空母を3隻撃沈せよ",            id: 211, required: [201],  state: YET, ristrict: "_date370" },
  212: {type: DAILY, trigger: SORTIE, title:"敵輸送船団を叩け！",             id: 212, required: [201],  state: YET, ristrict: "_date28" },
  218: {type: DAILY, trigger: SORTIE, title:"敵補給艦を3隻撃沈せよ！",        id: 218, required: [216],  state: YET},
  210: {type: DAILY, trigger: SORTIE, title:"敵艦隊を10回邀撃せよ！",         id: 210, required: [216],  state: YET},
  226: {type: DAILY, trigger: SORTIE, title:"南西諸島海域の制海権を握れ！",   id: 226, required: [218],  state: YET},
  230: {type: DAILY, trigger: SORTIE, title:"敵潜水艦を制圧せよ！",           id: 230, required: [226],  state: YET},
  // 演習 計2
  303: {type: DAILY, trigger: PRACTICE, title:"「演習」で練度向上！",           id: 303, required: [],     state: YET},
  304: {type: DAILY, trigger: PRACTICE, title:"「演習」で他提督を圧倒せよ！",   id: 304, required: [303],  state: YET},
  // 遠征 計2
  402: {type: DAILY, trigger: MISSION, title:"「遠征」を3回成功させよう！",    id: 402, required: [],     state: YET},
  403: {type: DAILY, trigger: MISSION, title:"「遠征」を10回成功させよう！",   id: 403, required: [402],  state: YET},
  // 補給・入渠 計2
  503: {type: DAILY, trigger: RECOVERY, title:"艦隊大整備！",                   id: 503, required: [],     state: YET},
  504: {type: DAILY, trigger: SUPPLY, title:"艦隊酒保祭り！",                 id: 504, required: [503],  state: YET},
  // 工廠 計6
  605: {type: DAILY, trigger: CREATEITEM, title:"新装備「開発」指令",             id: 605, required: [],     state: YET},
  606: {type: DAILY, trigger: CREATESHIP, title:"新造艦「建造」指令",             id: 606, required: [605],  state: YET},
  607: {type: DAILY, trigger: CREATEITEM, title:"装備「開発」集中強化！",         id: 607, required: [606],  state: YET},
  608: {type: DAILY, trigger: CREATESHIP, title:"艦娘「建造」艦隊強化！",         id: 608, required: [607],  state: YET},
  609: {type: DAILY, trigger: DESTROYSHIP, title:"軍縮条約対応！",                 id: 609, required: [608],  state: YET},
  619: {type: DAILY, trigger: REMODEL, title:"装備の改修強化",                 id: 619, required: [608],  state: YET},
  // 改修 計1
  702: {type: DAILY, trigger: CUSTOMIZE, title:"艦の「近代化改修」を実施せよ！", id : 702, required : [],   state : YET}
};
