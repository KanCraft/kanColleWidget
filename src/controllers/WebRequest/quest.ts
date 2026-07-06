import { quests, QuestCategory } from "../../catalog";
import { QUEST_ALERT_NOTIFICATION_ID } from "../../models/configs/NotificationConfig";
import { QuestProgress } from "../../models/QuestProgress";
import { NotificationService } from "../../services/NotificationService";
import { QuestActionFormData } from "./datatypes";

export async function onQuestStart([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const { api_quest_id: [id] } = details.requestBody?.formData as unknown as QuestActionFormData;
  await (await QuestProgress.user()).start(parseInt(id, 10));
}

export async function onQuestStop([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const { api_quest_id: [id] } = details.requestBody?.formData as unknown as QuestActionFormData;
  await (await QuestProgress.user()).stop(parseInt(id, 10));
}

export async function onQuestComplete([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const { api_quest_id: [id] } = details.requestBody?.formData as unknown as QuestActionFormData;
  await (await QuestProgress.user()).complete(parseInt(id, 10));
}

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
