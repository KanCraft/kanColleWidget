import { QuestProgress } from "../../../Models/Quest";
import { Category } from "../../../Models/Quest/consts";
import QuestAlertSetting from "../../../Models/Settings/QuestAlertSetting";
import NotificationService from "../../../../Services/Notification";

/**
 * @MESSAGE /api_get_member/practice
 */
export async function OnPracticePrepare() {
  const quests = QuestProgress.user().availables(Category.Practice);
  const setting = QuestAlertSetting.user();
  if (quests.length == 0 || !setting.enabled) return;
  const opt = setting.getChromeOptions(quests);
  const nid = setting.toNotificationID();
  const ns = new NotificationService();
  await ns.create(nid, opt);
}