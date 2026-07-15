import Queue from "../models/Queue";
import { EntryType } from "../models/entry";

// 種別ごとのバッジ背景色。任務トラッカー（QuestTrackerList.tsx の CATEGORY_COLORS）と
// 意図的に同じ配色（v3 dashboard.scss 準拠）を使っている。
const BADGE_COLORS: Partial<Record<EntryType, string>> = {
  [EntryType.MISSION]: "#5755d9",
  [EntryType.RECOVERY]: "#56c2c1",
  [EntryType.SHIPBUILD]: "#fa9836",
};
const DEFAULT_BADGE_COLOR = "gray";

/**
 * 拡張機能アイコンのバッジ表示を担うサービス。
 * 完了が最も近いQueueの残り時間を、種別ごとの背景色でバッジに表示する。
 */
export class BadgeService {
  /**
   * Queueの一覧からバッジ表示を更新する。
   * 期限前のQueueが無ければバッジを消す。
   */
  public async update(queues: Queue[]): Promise<void> {
    const nearest = queues
      .filter((queue) => queue.scheduled > Date.now())
      .sort((prev, next) => prev.scheduled - next.scheduled)[0];
    if (!nearest) {
      await chrome.action.setBadgeText({ text: "" });
      return;
    }
    const { hours, minutes } = nearest.remain();
    const text = hours > 0 ? `${hours}h` : `${minutes}m`;
    await chrome.action.setBadgeText({ text });
    await chrome.action.setBadgeBackgroundColor({
      color: BADGE_COLORS[nearest.type] ?? DEFAULT_BADGE_COLOR,
    });
  }
}
