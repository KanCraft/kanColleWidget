import Config from "../../../Models/Config";
import Quest, {YET} from "../../../Models/Quest";
import NotificationService from "../../../Services/NotificationService";

export function checkQuestStatus(trigger) {
  const quests = Quest.daily(false).filter(q => q.trigger == trigger && q.state == YET);
  if (quests.length && Config.find("quest-manager-alert").value) {
    const notifications = new NotificationService();
    notifications.create(...Quest.alert(quests));
  }
}
