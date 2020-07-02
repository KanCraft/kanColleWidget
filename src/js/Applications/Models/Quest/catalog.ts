import { Group, Status, Category, Condition } from "./consts";

const catalog: {
  [id: number]: {
    id: number;
    title: string;
    group: Group;
    status: Status;
    category: Category;
    requires: number[];
    condition?: Condition;
  }
} = {
  201: {
    id: 201,
    title: "敵艦隊を撃破せよ！",
    group: Group.Daily,
    status: Status.Open,
    category: Category.Sortie,
    requires: [],
  },
  210: {
    id: 210,
    title: "敵艦隊を10回邀撃せよ！",
    group: Group.Daily,
    status: Status.Unavailable,
    category: Category.Sortie,
    requires: [216],
  },
  211: {
    id: 211,
    title: "敵空母を3隻撃沈せよ！",
    group: Group.Daily,
    status: Status.Unavailable,
    category: Category.Sortie,
    requires: [201],
    condition: Condition.Date037,
  },
  212: {
    id: 212,
    title: "敵輸送船団を叩け！",
    group: Group.Daily,
    status: Status.Unavailable,
    category: Category.Sortie,
    requires: [201],
    condition: Condition.Date28,
  },
  216: {
    id: 216,
    title: "敵艦隊主力を撃滅せよ！",
    group: Group.Daily,
    status: Status.Unavailable,
    category: Category.Sortie,
    requires: [201],
  },
  218: {
    id: 218,
    title: "敵補給艦を3隻撃沈せよ！",
    group: Group.Daily,
    status: Status.Unavailable,
    category: Category.Sortie,
    requires: [216],
  },
  226: {
    id: 226,
    title: "南西諸島海域の制海権を握れ！",
    group: Group.Daily,
    status: Status.Unavailable,
    category: Category.Sortie,
    requires: [218],
  },
  230: {
    id: 230,
    title: "敵潜水艦を制圧せよ！",
    group: Group.Daily,
    status: Status.Unavailable,
    category: Category.Sortie,
    requires: [226],
  },
  // TODO: もっと足す
};

export default catalog;