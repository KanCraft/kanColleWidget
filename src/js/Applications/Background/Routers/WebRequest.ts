/**
 * chrome.webRequest.onBeforeRequest
 * background.js で扱うためのルーティングを定義します。
 * requestBodyが必要なリクエストフックはここに定義。
 */
import {SerialRouter} from "chomex";

import { OnAirBattleStarted, OnBattleStarted } from "../Controllers/Request/Battle";
import { OnMapStart } from "../Controllers/Request/Map";
import { OnMissionStart, OnMissionResult } from "../Controllers/Request/Mission";
import { OnPort } from "../Controllers/Request/Port";
import { OnRecoveryStart, OnRecoveryHighspeed } from "../Controllers/Request/Recovery";
import { OnShipbuildingStart, OnShipbuildingGetShip, OnShipbuildingHighspeed } from "../Controllers/Request/Shipbuilding";

const resolver = (detail) => {
  // host部分を削除したものをrouting nameとして使う
  return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};

const router = new SerialRouter(2, resolver);

// 母港寄港
router.on(["api_port/port"], OnPort);

// 修復関係
router.on(["api_req_nyukyo/start"], OnRecoveryStart);
router.on(["api_req_nyukyo/speedchange"], OnRecoveryHighspeed);

// 工廠関係
router.on(["api_req_kousyou/createship"], OnShipbuildingStart);
router.on(["api_req_kousyou/getship"], OnShipbuildingGetShip);
router.on(["api_req_kousyou/createship_speedchange"], OnShipbuildingHighspeed);

// 遠征関係
router.on(["api_req_mission/start"], OnMissionStart);
router.on(["api_req_mission/result"], OnMissionResult);

// 出撃
router.on(["api_req_map/start"], OnMapStart); // 出撃開始

// 戦闘開始時
router.on(["api_req_sortie/battle"], OnBattleStarted); // 通常艦隊
router.on(["api_req_combined_battle/battle"], OnBattleStarted); // 機動部隊
router.on(["api_req_combined_battle/battle_water"], OnBattleStarted); // 水上部隊
router.on(["api_req_combined_battle/each_battle"], OnBattleStarted); // 機動部隊+友軍
router.on(["api_req_combined_battle/each_battle_water"], OnBattleStarted); // 水上部隊+友軍
router.on(["api_req_combined_battle/ec_battle"], OnBattleStarted); // 通常vs連合+友軍
router.on(["api_req_combined_battle/sp_midnight"], OnBattleStarted); // 連合艦隊 夜戦マス
router.on(["api_req_battle_midnight/sp_midnight"], OnBattleStarted); // 通常艦隊 夜戦マス
router.on(["api_req_sortie/airbattle"], OnAirBattleStarted);
router.on(["api_req_sortie/ld_airbattle"], OnAirBattleStarted); // 通常編成 空襲戦
router.on(["api_req_combined_battle/ld_airbattle"], OnAirBattleStarted); // 連合艦隊 空襲戦
router.on(["api_req_map/start_air_base"], OnAirBattleStarted); // イベントの基地航空戦？

export default router.listener();
