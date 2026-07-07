import { quests, QuestCategory } from "../../catalog";
import { QUEST_ALERT_NOTIFICATION_ID } from "../../models/configs/NotificationConfig";
import { QuestProgress } from "../../models/QuestProgress";
import { NotificationService } from "../../services/NotificationService";
import { QuestActionFormData } from "./datatypes";
import { formData } from "./formdata";

// api_req_quest/{start,stop,clearitemget} 共通: formData の任務IDに
// QuestProgress の指定メソッドを適用するハンドラを生成する
function onQuestAction(action: "start" | "stop" | "complete") {
  return async ([details]: chrome.webRequest.OnBeforeRequestDetails[]) => {
    const data = formData<QuestActionFormData>(details);
    if (!data) return;
    await (await QuestProgress.user())[action](parseInt(data.api_quest_id[0], 10));
  };
}
export const onQuestStart = onQuestAction("start");
export const onQuestStop = onQuestAction("stop");
export const onQuestComplete = onQuestAction("complete");

// 指定カテゴリに着手可能なのにまだ着手していない任務があれば、その一覧を通知する
async function warnIfQuestNotAccepted(category: QuestCategory, notificationId: string, title: string) {
  const ids = (await QuestProgress.user()).availables(category);
  if (ids.length === 0) return;
  const message = ids.map((id) => quests[String(id)].title).join("\n");
  await NotificationService.new().notifyRaw(notificationId, QUEST_ALERT_NOTIFICATION_ID, (config) => ({
    type: "basic",
    iconUrl: config.icon ?? chrome.runtime.getURL("icons/128.png"),
    title,
    message,
  }));
}

export async function onPracticePrepare() {
  await warnIfQuestNotAccepted("practice", "/quest-alert/practice", "演習任務が未着手です");
}

export async function onSortiePrepare() {
  await warnIfQuestNotAccepted("sortie", "/quest-alert/sortie", "出撃任務が未着手です");
}
