import Sortie from "../../../Models/Sortie";
import {
  DebuggableRequest,
} from "../../../../definitions/debuggable";
import Tiredness from "../../../Models/Queue/Tiredness";

/**
 * 出撃関係
 */

export function OnMapStart(req: DebuggableRequest) {
  const context = Sortie.context();
  const { api_deck_id: [deck], api_maparea_id: [area], api_mapinfo_no: [info] } = req.requestBody.formData;
  context.start(parseInt(area, 10), parseInt(info, 10));

  // 疲労タイマーの登録
  const interval = 15 * 60 * 1000;
  const tiredness = new Tiredness({ deck, interval });
  tiredness.register(Date.now() + interval);
}
