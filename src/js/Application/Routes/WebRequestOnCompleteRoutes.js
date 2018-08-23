import {SerialRouter} from "chomex";
import * as Controllers from "../Controllers/RequestControllers";

const resolver = (detail) => {
    // host部分を削除したものをrouting nameとして使う
  return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};

let onCompletedRouter = new SerialRouter(3, resolver);

onCompletedRouter.on([
  "api_req_sortie/battleresult",
], Controllers.onBattleResulted);

onCompletedRouter.on([
  "api_req_combined_battle/battleresult",
], Controllers.onCombinedBattleResulted);

onCompletedRouter.on([
  true, // その後1回なんらかのリクエストがある
  "api_req_nyukyo/start" // まずnyukyo開始のリクエストがあって
], Controllers.onRecoveryStartCompleted);

onCompletedRouter.on([
  true, // その後1回なんらかのリクエストがある
  "api_req_kousyou/createship" // まずcreateshipのリクエストがあって、
], Controllers.onCreateShipCompleted);

const WebRequestOnCompleteListener = onCompletedRouter.listener();

export {
  WebRequestOnCompleteListener
};
