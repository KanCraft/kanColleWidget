import Achievement from "../../Models/Achievement";
import Config from "../../Models/Config";
import Quest, {YET} from "../../Models/Quest";
import {PRACTICE}  from "../../../Constants";
import NotificationService from "../../Services/NotificationService";

export function onPracticeStart() {
  Achievement.increment(PRACTICE);
}

export function onPracticePrepare() {
  const quests = Quest.daily(false).filter(q => q.trigger == PRACTICE && q.state == YET);
  if (quests.length && Config.find("quest-manager-alert").value) {
    const notifications = new NotificationService();
    notifications.create(...Quest.alert(quests));
  }
}
