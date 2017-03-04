import Config from "../../Models/Config";
import {ScheduledQueues, Tiredness} from "../../Models/Queue/Queue";

import {SORTIE} from "../../../Constants";
import Achievement from "../../Models/Achievement";

import SortieContext from "../../Services/SortieContext";

export function onSortieStart(detail) {

  Achievement.increment(SORTIE);

  const {requestBody:{formData:{api_maparea_id:[area],api_mapinfo_no:[info]}}} = detail;
  SortieContext.sharedInstance().start(area, info);

  if (!Config.isNotificationEnabled("tiredness")) return;

  // const {requestBody:{formData:{api_deck_id:[deck]}}} = detail;
  const time = Date.now() + Config.find("notification-for-tiredness").time * (1000 * 60);
  // TODO:ここで設定をみる
  // const tiredness = new Tiredness(time, parseInt(deck));
  const tiredness = new Tiredness(time, Date.now());

    // TODO: Controllerからchromeを参照するのはやめましょう
  chrome.notifications.getAll(notes => {
    Object.keys(notes).filter(id => { return id.match(/^tiredness/); }).map(id => {
      chrome.notifications.clear(id);
    });
  });
  ScheduledQueues.append("tiredness", tiredness);
}
