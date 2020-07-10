import Sortie from "../../../Models/Sortie";
import {
  DebuggableRequest,
} from "../../../../definitions/debuggable";
import Tiredness from "../../../Models/Queue/Tiredness";
import { QuestProgress } from "../../../Models/Quest";
import { Category } from "../../../Models/Quest/consts";
import NotificationService from "../../../../Services/Notification";
import QuestAlertSetting from "../../../Models/Settings/QuestAlertSetting";
import SortieContextSetting from "../../../Models/Settings/SortieContextSetting";

/**
 * @MESSAGE /api_get_member/mapinfo
 * @param req
 */
export async function OnMapPrepare(/* req: DebuggableRequest */) {
  const qp = QuestProgress.user();
  const quests = qp.availables(Category.Sortie);
  const setting = QuestAlertSetting.user();
  if (quests.length == 0 || !setting.enabled) return;
  const opt = setting.getChromeOptions(quests);
  const nid = setting.toNotificationID();
  const ns = new NotificationService();
  await ns.create(nid, opt);
}

export async function OnMapStart(req: DebuggableRequest) {
  const context = Sortie.context();
  const { api_deck_id: [deck], api_maparea_id: [area], api_mapinfo_no: [info] } = req.requestBody.formData;
  context.start(parseInt(area, 10), parseInt(info, 10));

  // 疲労タイマーの登録
  const interval = 15 * 60 * 1000;
  const setting = SortieContextSetting.user();
  const tiredness = new Tiredness({ deck, interval, label: context.toText(setting.type, false) });
  tiredness.register(Date.now() + interval);

  await (new NotificationService).clearAll(/^Tiredness/);
}
