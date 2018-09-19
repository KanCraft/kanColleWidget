/**
 * chrome.webRequest.onBeforeRequest
 * background.js で扱うためのルーティングを定義します。
 * requestBodyが必要なリクエストフックはここに定義。
 */
import {SerialRouter} from "chomex";
import {
  OnAirBattleStarted,
  OnBattleStarted,
  OnPort,
} from "../Controllers/onBeforeRequest";

const resolver = (detail) => {
  // host部分を削除したものをrouting nameとして使う
  return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};

const router = new SerialRouter(2, resolver);

// 母港寄港
router.on(["api_port/port"], OnPort);
// 戦闘終了
router.on(["api_req_sortie/battle"],          OnBattleStarted);
router.on(["api_req_combined_battle/battle_water"], OnBattleStarted); // イベント中の連合艦隊
router.on(["api_req_sortie/airbattle"],    OnAirBattleStarted);
router.on(["api_req_sortie/ld_airbattle"], OnAirBattleStarted); // イベント中の航空戦

export default router.listener();
