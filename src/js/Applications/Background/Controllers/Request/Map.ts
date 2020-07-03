import Sortie from "../../../Models/Sortie";
import {
  DebuggableRequest,
} from "../../../../definitions/debuggable";
import Tiredness from "../../../Models/Queue/Tiredness";
import { QuestProgress } from "../../../Models/Quest";
import { Category } from "../../../Models/Quest/consts";
import NotificationService from "../../../../Services/Notification";

/**
 * @MESSAGE /api_get_member/mapinfo
 * @param req
 */
export async function OnMapPrepare(/* req: DebuggableRequest */) {
  const qp = QuestProgress.user();
  const quests = qp.availables(Category.Sortie);
  if (quests.length != 0) {
    // {{{ TODO: なにかしらSettingのモデルを使う
    const iconUrl = chrome.extension.getURL("dest/img/app/icon.128.png");
    const title = "未着手任務があります";
    const message = `${quests.map(q => `・${q.title} [${q.id}]\n`)}`;
    const id = `QuestAlert?ts=${Date.now()}`;
    // }}}
    const ns = new NotificationService();
    await ns.create(id, { iconUrl, title, message, type: "basic" });
  }
}

export function OnMapStart(req: DebuggableRequest) {
  const context = Sortie.context();
  const { api_deck_id: [deck], api_maparea_id: [area], api_mapinfo_no: [info] } = req.requestBody.formData;
  context.start(parseInt(area, 10), parseInt(info, 10));

  // 疲労タイマーの登録
  const interval = 15 * 60 * 1000;
  const tiredness = new Tiredness({ deck, interval, label: context.toText(false) });
  tiredness.register(Date.now() + interval);
}
