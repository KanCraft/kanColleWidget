import { Model, Types } from "chomex";
import { Group, Status, Category, Condition } from "./consts";
import catalog from "./catalog";

export class Quest extends Model {

  // chomex.Model.Types.reference.eagerを使わないのでたぶんこれはいらない
  static __ns = "Quest";

  static schema = {
    id: Types.number,
    title: Types.string,
    group: Types.string,
    status: Types.string,
    category: Types.string,
    requires: Types.arrayOf(Types.number),
    condition: Types.string,
  }
  id: number;
  title: string;
  group: Group;
  status: Status;
  category: Category;
  requires: number[];
  condition?: Condition;

  /**
   * 今現在任務として見えるかどうかを返す
   */
  get visible(): boolean {
    if (this.status == Status.Unavailable) return false;
    return this.availableToday(new Date());
  }

  /**
   * 着手可能かどうかを返す
   */
  get available(): boolean {
    if (this.status != Status.Open) return false;
    return this.availableToday(new Date());
  }

  get completed(): boolean {
    return this.status == Status.Completed;
  }

  // TODO: 命名が悪い
  private availableToday(now: Date): boolean {
    const date = now.toKCDate().getDate().toString();
    switch (this.condition) {
    case Condition.Date037:
      return /[037]$/.test(date);
    case Condition.Date28:
      return /[28]$/.test(date);
    default:
      return true;
    }
  }
}

export class QuestProgress extends Model {

  static __ns = "QuestProgress";
  static ukey = "user"; // 1モデル1エンティティなので

  static schema = {
    quests: Types.dictOf(Types.reference(Quest)),
    lastRefreshed: Types.date,
  }
  quests: { [id: number]: Quest };
  lastRefreshed: Date;

  /**
   * カタログからQuestのdictを生成して返す.
   * デフォルトではすべてのGroupのエントリを返す.
   * @param {Group[]} groups
   * @returns {[id:number]: Quest}
   */
  private static construct(
    groups: Group[] = [Group.Daily, Group.Weekly, Group.Monthly, Group.Quarterly, Group.Yearly]
  ): { [id: number]: Quest } {
    return Object.entries(catalog).reduce((ctx, [id, entry]) => {
      if (groups.includes(entry.group)) ctx[id] = Quest.new({ id: parseInt(id, 10), ...entry });
      return ctx;
    }, {});
  }

  /**
   * 唯一Storageにストアされてるものを返す.
   */
  static user(): QuestProgress {
    const qp: QuestProgress = this.find(this.ukey) || this.new({ _id: this.ukey, quests: this.construct(), lastRefreshed: new Date() });
    const groups = qp.shouldRefresh(new Date());
    return qp.refresh(groups);
  }
  shouldRefresh(now: Date = new Date()): Group[] {
    const groups = [];
    if (this.lastRefreshed.getKCDate() != now.getKCDate()) groups.push(Group.Daily);
    return groups;
  }
  refresh(groups: Group[] = [Group.Daily]): QuestProgress {
    const quests = QuestProgress.construct(groups);
    return this.update({ quests: { ...this.quests, ...quests }, lastRefreshed: new Date() });
  }

  start(id: number): QuestProgress {
    if (!this.quests[id]) return this; // TODO: なんかする
    this.quests[id].status = Status.Ongoing;
    return this.update({ quests: { ...this.quests } });
  }
  stop(id: number): QuestProgress {
    if (!this.quests[id]) return this; // TODO: なんかする
    this.quests[id].status = Status.Open;
    return this.update({ quests: { ...this.quests } });
  }
  complete(id: number): QuestProgress {
    if (!this.quests[id]) return this; // TODO: なんかする
    this.quests[id].status = Status.Completed;
    const quests = Object.values(this.quests).reduce((ctx, q) => {
      if (q.id == id) { ctx[q.id] = q; return ctx; }
      if (!q.requires || q.requires.length == 0) { ctx[q.id] = q; return ctx; }
      if (!q.requires.includes(id)) { ctx[q.id] = q; return ctx; }
      if (q.requires.every(x => this.quests[x].completed)) q.status = Status.Open;
      ctx[q.id] = q;
      return ctx;
    }, {});
    return this.update({ quests });
  }

  /**
   * 指定されたカテゴリにおいて着手可能未着手のQuestリストを返す.
   * @param {Category} category
   */
  availables(category: Category): Quest[] {
    return Object.values(this.quests).filter(q => q.category == category && q.available);
  }

}
