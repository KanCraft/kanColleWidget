import { Model } from "jstorm/chrome/local";
import { quests, QuestCategory } from "../catalog";
import { KCWDate } from "../utils";

export enum QuestStatus {
  LOCKED = "locked", // 前提任務未達成で着手不可
  OPEN = "open", // 着手可能で未着手
  ONGOING = "ongoing", // 着手中
  COMPLETED = "completed", // 達成・報酬受領済み
}

export interface VisibleQuest {
  id: number;
  title: string;
  category: QuestCategory;
  status: QuestStatus;
}

// 任務トラッカー表示での並び順（未着手→遂行中→達成）。LOCKEDはvisibleQuestsで除外される
const STATUS_ORDER: Record<QuestStatus, number> = {
  [QuestStatus.OPEN]: 0,
  [QuestStatus.ONGOING]: 1,
  [QuestStatus.COMPLETED]: 2,
  [QuestStatus.LOCKED]: 3,
};

function initialStatuses(): Record<number, QuestStatus> {
  return Object.entries(quests).reduce((acc, [id, spec]) => {
    acc[Number(id)] = spec.requires.length === 0 ? QuestStatus.OPEN : QuestStatus.LOCKED;
    return acc;
  }, {} as Record<number, QuestStatus>);
}

// 日付条件付き任務（211/212）が当日出現するかどうか
function isVisibleToday(id: number, now: number): boolean {
  const condition = quests[String(id)]?.condition;
  if (!condition) return true;
  const lastDigit = KCWDate.dayOfMonth(now) % 10;
  switch (condition) {
  case "date037": return lastDigit === 0 || lastDigit === 3 || lastDigit === 7;
  case "date28": return lastDigit === 2 || lastDigit === 8;
  }
}

// デイリー任務の着手状況。前提任務の連鎖（requires）を解決しながら、
// カテゴリごとの「今日まだ着手していない任務」を availables() で取得できる。
export class QuestProgress extends Model {
  static override _namespace_ = "QuestProgress";
  static override default = {
    "user": { statuses: initialStatuses(), refreshedAt: 0 },
  };

  public statuses: Record<number, QuestStatus> = {};
  public refreshedAt: number = 0;

  public static async user(): Promise<QuestProgress> {
    const progress = (await this.find("user"))!;
    return progress.refreshed();
  }

  private async refreshed(now: number = Date.now()): Promise<QuestProgress> {
    if (KCWDate.isSameKCDay(this.refreshedAt, now)) return this;
    return this.update({ statuses: initialStatuses(), refreshedAt: now });
  }

  public async start(id: number): Promise<QuestProgress> {
    if (!(id in this.statuses)) return this;
    return this.update({ statuses: { ...this.statuses, [id]: QuestStatus.ONGOING } });
  }

  public async stop(id: number): Promise<QuestProgress> {
    if (!(id in this.statuses)) return this;
    return this.update({ statuses: { ...this.statuses, [id]: QuestStatus.OPEN } });
  }

  public async complete(id: number): Promise<QuestProgress> {
    if (!(id in this.statuses)) return this;
    const statuses = { ...this.statuses, [id]: QuestStatus.COMPLETED };
    for (const [qid, spec] of Object.entries(quests)) {
      const numId = Number(qid);
      if (statuses[numId] !== QuestStatus.LOCKED) continue;
      if (spec.requires.every((r) => statuses[r] === QuestStatus.COMPLETED)) statuses[numId] = QuestStatus.OPEN;
    }
    return this.update({ statuses });
  }

  // 指定カテゴリで、着手可能なのにまだ着手していない任務のIDを返す
  public availables(category: QuestCategory, now: number = Date.now()): number[] {
    return Object.entries(quests)
      .filter(([, spec]) => spec.category === category)
      .map(([id]) => Number(id))
      .filter((id) => this.statuses[id] === QuestStatus.OPEN && isVisibleToday(id, now));
  }

  // カテゴリを問わず、その日「見えている」（前提未達成や日付条件で隠れていない）任務を
  // 未着手→遂行中→達成の順で返す。任務トラッカー表示用
  public visibleQuests(now: number = Date.now()): VisibleQuest[] {
    return Object.entries(quests)
      .map(([id, spec]) => ({ id: Number(id), title: spec.title, category: spec.category, status: this.statuses[Number(id)] }))
      .filter((q) => q.status !== QuestStatus.LOCKED && isVisibleToday(q.id, now))
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  }
}
