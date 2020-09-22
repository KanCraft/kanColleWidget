import { Group, Status, Category, Condition } from "./consts";

const catalog: {
  [id: number]: {
    title: string;
    group: Group;
    status: Status;
    category: Category;
    requires: number[];
    condition?: Condition;
  }
} = {
  201: {
    title: "敵艦隊を撃破せよ！",
    requires: [],
    group: Group.Daily, category: Category.Sortie, status: Status.Open,
  },
  216: {
    title: "敵艦隊主力を撃滅せよ！",
    requires: [201],
    group: Group.Daily, category: Category.Sortie, status: Status.Unavailable,
  },
  210: {
    title: "敵艦隊を10回邀撃せよ！",
    requires: [216],
    group: Group.Daily, category: Category.Sortie, status: Status.Unavailable,
  },
  218: {
    title: "敵補給艦を3隻撃沈せよ！",
    requires: [216],
    group: Group.Daily, category: Category.Sortie, status: Status.Unavailable,
  },
  226: {
    title: "南西諸島海域の制海権を握れ！",
    requires: [218],
    group: Group.Daily, category: Category.Sortie, status: Status.Unavailable,
  },
  230: {
    title: "敵潜水艦を制圧せよ！",
    requires: [226],
    group: Group.Daily, category: Category.Sortie, status: Status.Unavailable,
  },
  303: {
    title: "「演習」で練度向上！",
    requires: [],
    group: Group.Daily, category: Category.Practice, status: Status.Open,
  },
  304: {
    title: "「演習」で他提督を圧倒せよ！",
    requires: [303],
    group: Group.Daily, category: Category.Practice, status: Status.Unavailable,
  },
  402: {
    title: "「遠征」を3回成功させよう！",
    requires: [],
    group: Group.Daily, category: Category.Mission, status: Status.Open,
  },
  403: {
    title: "「遠征」を10回成功させよう！",
    requires: [402],
    group: Group.Daily, category: Category.Mission, status: Status.Unavailable,
  },
  503: {
    title: "艦隊大整備！",
    requires: [],
    group: Group.Daily, category: Category.Recovery, status: Status.Open,
  },
  504: {
    title: "艦隊酒保祭り！",
    requires: [503],
    group: Group.Daily, category: Category.Recovery, status: Status.Unavailable,
  },
  605: {
    title: "新装備「開発」指令",
    requires: [],
    group: Group.Daily, category: Category.CreateItem, status: Status.Open,
  },
  606: {
    title: "新造艦「建造」指令",
    requires: [605],
    group: Group.Daily, category: Category.Shipbuilding, status: Status.Unavailable,
  },
  607: {
    title: "装備「開発」集中強化！",
    requires: [606],
    group: Group.Daily, category: Category.CreateItem, status: Status.Unavailable,
  },
  608: {
    title: "艦娘「建造」艦隊強化！",
    requires: [607],
    group: Group.Daily, category: Category.Shipbuilding, status: Status.Unavailable,
  },
  609: {
    title: "軍縮条約対応！",
    requires: [608],
    group: Group.Daily, category: Category.DestroyShip, status: Status.Unavailable,
  },
  619: {
    title: "装備の改修強化",
    requires: [608],
    group: Group.Daily, category: Category.Remodel, status: Status.Unavailable,
  },
  673: {
    title: "装備開発力の整備",
    requires: [607],
    group: Group.Daily, category: Category.CreateItem, status: Status.Unavailable,
  },
  674: {
    title: "工廠環境の整備",
    requires: [673],
    group: Group.Daily, category: Category.Remodel, status: Status.Unavailable,
  },
  702: {
    title: "艦の「近代化改修」を実施せよ！",
    requires: [],
    group: Group.Daily, category: Category.Shipbuilding, status: Status.Open,
  },
  211: {
    title: "敵空母を3隻撃沈せよ！",
    requires: [201],
    group: Group.Daily, category: Category.Sortie, status: Status.Unavailable,
    condition: Condition.Date037,
  },
  212: {
    title: "敵輸送船団を叩け！",
    requires: [201],
    group: Group.Daily, category: Category.Sortie, status: Status.Unavailable,
    condition: Condition.Date28,
  },
  214: {
    title: "あ号作戦",
    requires:[216],
    group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,
  },
  220: {
    title: "い号作戦",
    requires:[218],
    group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,
  },
  213: {
    title: "海上通商破壊作戦",
    requires:[216],
    group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable
    ,},
  221: {
    title: "ろ号作戦",
    requires:[214],
    group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,
  },
  228: {
    title: "海上護衛戦",
    requires:[220],
    group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,
  },
  229: {
    title: "敵東方艦隊を撃滅せよ！",
    requires:[228],
    group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,
  },
  241: {
    title: "敵北方艦隊主力を撃滅せよ！",
    requires:[228],
    group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,
  },
// TODO: IDを調べる
// : {title: "敵東方中枢艦隊を撃破せよ！",requires:[229],group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,},
// : {title: "南方海域珊瑚諸島沖の制空権を握れ！",requires:[],group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,},
// : {title: "海上輸送路の安全確保に努めよ！",requires:[, 221],group: Group.Weekly, category: Category.Sortie,status: Status.Unavailable,},
  302: {
    title: "大規模演習",
    requires:[303],
    group: Group.Weekly, category: Category.Practice,status: Status.Unavailable,
  },
  404: {
    title: "大規模遠征作戦、発令！",
    requires:[],
    group: Group.Weekly, category: Category.Practice,status: Status.Unavailable,
  },
  410: {
    title: "南方への輸送作戦を成功させよ！",
    requires:[],
    group: Group.Weekly, category: Category.Mission,status: Status.Unavailable,
  },
  411: {
    title: "南方への鼠輸送を継続実施せよ！",
    requires:[410],
    group: Group.Weekly, category: Category.Mission,status: Status.Unavailable,
  },
  613: {
    title: "資源の再利用",
    requires:[228],
    group: Group.Weekly, category: Category.DestroyItem,status: Status.Unavailable,
  },
  638: {
    title: "対空機銃量産",
    requires:[619],
    group: Group.Weekly, category: Category.DestroyItem,status: Status.Unavailable,
  },
  676: {
    title: "装備開発力の集中整備",
    requires:[674],
    group: Group.Weekly, category: Category.DestroyItem,status: Status.Unavailable,
  },
  677: {
    title: "継戦支援能力の整備",
    requires:[674],
    group: Group.Weekly, category: Category.DestroyItem,status: Status.Unavailable,
  },
  703: {
    title: "「近代化改修」を進め、戦備を整えよ！",
    requires:[702],
    group: Group.Weekly, category: Category.Shipbuilding,status: Status.Unavailable,
  },
};

export default catalog;