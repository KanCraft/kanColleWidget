/**
 * chrome.webRequest.onBeforeRequest
 * background.js で扱うためのルーティングを定義します。
 * requestBodyが必要なリクエストフックはここに定義。
 */
import {SerialRouter} from "chomex";

import { OnAirBattleStarted, OnBattleStarted } from "../Controllers/Request/Battle";
import { OnMissionStart } from "../Controllers/Request/Mission";
import { OnPort } from "../Controllers/Request/Port";
import { OnRecoveryStart } from "../Controllers/Request/Recovery";
import { OnShipbuildingStart } from "../Controllers/Request/Shipbuilding";

const resolver = (detail) => {
  // host部分を削除したものをrouting nameとして使う
  return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};

const router = new SerialRouter(2, resolver);

// 母港寄港
router.on(["api_port/port"], OnPort);

// 修復関係
router.on(["api_req_nyukyo/start"], OnRecoveryStart);

// 工廠関係
router.on(["api_req_kousyou/createship"], OnShipbuildingStart);

// 遠征関係
router.on(["api_req_mission/start"],  OnMissionStart);

// 戦闘開始時
router.on(["api_req_sortie/battle"],                OnBattleStarted);
router.on(["api_req_combined_battle/battle"],       OnBattleStarted); // イベント中の連合艦隊
router.on(["api_req_combined_battle/battle_water"], OnBattleStarted); // イベント中の連合艦隊
router.on(["api_req_combined_battle/each_battle"],  OnBattleStarted); // イベント中の連合艦隊
router.on(["api_req_sortie/airbattle"],          OnAirBattleStarted);
router.on(["api_req_sortie/ld_airbattle"],       OnAirBattleStarted); // イベント中の航空戦
router.on(["api_req_map/start_air_base"],        OnAirBattleStarted); // イベントの基地航空戦？

export default router.listener();
