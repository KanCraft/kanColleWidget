import Config from "../../../Models/Config";
import Quest, {YET} from "../../../Models/Quest";
import NotificationService from "../../../Services/NotificationService";

export function checkQuestStatus(trigger) {
  const quests = Quest.daily(false).filter(q => q.trigger == trigger && q.state == YET);
  const config = Config.find("quest-manager-alert");
  if (quests.length == 0) return;
  switch (config.value) {
  case false:      return;
  case "disabled": return;
  case "notification": return (new NotificationService()).create(...Quest.alert(quests));
  case "alert":        return window.alert(Quest.alert(quests, true));
  }
}
