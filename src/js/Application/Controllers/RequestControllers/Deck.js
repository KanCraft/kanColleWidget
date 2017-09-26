/**
 * 編成画面のやつ
 */

import Config         from "../../Models/Config";
import RecordResource from "../../Routine/ResourceRecording";
export function onDeck() {
  if (Config.find("resource-statistics").value != "automatic") return true;
  return RecordResource(true);
}
