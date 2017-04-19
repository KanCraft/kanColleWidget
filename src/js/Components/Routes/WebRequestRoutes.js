import {SerialRouter} from "chomex";
import * as Controllers from "../Controllers/RequestControllers";

const resolver = (detail) => {
    // host部分を削除したものをrouting nameとして使う
  return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};
// XXX: いったいこれはなんでlength:4のSerialRouterなの？
let router = new SerialRouter(4, resolver);

// 遠征関係
router.on(["api_get_member/mission"], Controllers.onMissionPrepare);
router.on(["api_req_mission/start"],  Controllers.onMissionStart);
router.on(["api_req_mission/result"], Controllers.onMissionResult);
router.on(["api_get_member/mapinfo"], Controllers.onMapPrepare);
router.on(["api_req_kaisou/powerup"], Controllers.onKaisouPowerup);
router.on(["api_req_map/start"],      Controllers.onSortieStart);
// onCompletedではrequestBodyが取れないので、onRecoveryStartCompletedのために
// ここでrequestBodyを調達しておく必要がある
router.on(["api_req_nyukyo/start"],  Controllers.onRecoveryStart);
router.on(["api_req_nyukyo/speedchange"], Controllers.onRecoverySpeedup);
router.on(["api_req_hokyu/charge"],  Controllers.onSupply);

// 工廠関係
router.on(["api_req_kousyou/createship_speedchange"], Controllers.onCreateShipSpeedup);
router.on(["api_req_kousyou/createship"], Controllers.onCreateShipStart);
router.on(["api_req_kousyou/getship"], Controllers.onGetShip);
router.on(["api_req_kousyou/createitem"], Controllers.onCreateItem);
router.on(["api_req_kousyou/remodel_slotlist"],Controllers.onRemodelItemPrepare);
router.on(["api_req_kousyou/remodel_slot"], Controllers.onRemodelItem);
router.on(["api_req_kousyou/destroyitem2"], Controllers.onDestroyItem);
router.on(["api_req_kousyou/destroyship"],  Controllers.onDestroyShip);

// 演習関係
router.on(["api_req_practice/battle"], Controllers.onPracticeStart);
router.on(["api_get_member/practice"], Controllers.onPracticePrepare);

// 任務関係
router.on(["api_req_quest/start"],        Controllers.onQuestStart);
router.on(["api_req_quest/stop"],         Controllers.onQuestStop);
router.on(["api_req_quest/clearitemget"], Controllers.onQuestDone);

// 入渠画面への遷移時
router.on(["api_get_member/ndock"],  Controllers.onRecoveryDocksDisplayed);

// 通常艦隊の戦闘開戦時
router.on(["api_req_sortie/battle"],       Controllers.onBattleStarted);
router.on(["api_req_sortie/ld_airbattle"], Controllers.onBattleStarted);
// 連合艦隊戦開戦時
router.on(["api_req_combined_battle/battle"],           Controllers.onCombinedBattleStarted);
router.on(["api_req_combined_battle/each_battle"],      Controllers.onCombinedBattleStarted);
router.on(["api_req_combined_battle/battle_water"],     Controllers.onCombinedBattleStarted);
router.on(["api_req_combined_battle/each_battle_water"],Controllers.onCombinedBattleStarted);
router.on(["api_req_combined_battle/ld_airbattle"],     Controllers.onCombinedBattleStarted);

// 母校帰投
router.on(["api_port/port"],         Controllers.onHomePort);
// 編成画面表示
// router.on(["api_get_member/preset_deck"], Controllers.onDeck);

const WebRequestListener = router.listener();
export {
  WebRequestListener,
};
