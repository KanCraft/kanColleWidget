import Sortie from "../../../Models/Sortie";

/**
 * 出撃関係
 */

export function OnMapStart(req: DebuggableRequest) {
  const context = Sortie.context();
  const { api_deck_id: [deck], api_maparea_id: [area], api_mapinfo_no: [info] } = req.requestBody.formData;
  context.start(parseInt(area, 10), parseInt(info, 10));
}
