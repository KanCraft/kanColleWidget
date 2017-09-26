import Config         from "../../Models/Config";
import RecordResource from "../../Routine/ResourceRecording";
export function ResourceCapture() {
  if (Config.find("resource-statistics").value == "disabled") return Promise.reject("設定がオフ");
  return RecordResource(false);
}
