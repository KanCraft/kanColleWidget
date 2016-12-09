import {SerialRouter} from "chomex";
import * as Controllers from "../Controllers/RequestControllers";

let router = new SerialRouter(4);
router.on([{url: /api_req_mission\/start/}],  Controllers.onMissionStart);
router.on([{url: /api_req_mission\/result/}], Controllers.onMissionResult);
router.on([{url: /api_get_member\/mapinfo/}], Controllers.onMapPrepare);
router.on([{url: /api_req_kaisou\/powerup/}], Controllers.onKaisouPowerup);
// onCompletedではrequestBodyが取れないので、onRecoveryStartCompletedのために
// ここでrequestBodyを調達しておく必要がある
router.on([{url: /api_req_nyukyo\/start/}],  Controllers.onRecoveryStart);
router.on([{url: /api_req_kousyou\/createship/}], Controllers.onCreateShipStart);
router.on([{url: /api_req_sortie\/battle/}], Controllers.onBattleStarted);

// 入渠画面への遷移時
router.on([{url: /api_get_member\/ndock/}],  Controllers.onRecoveryDocksDisplayed);

// 連合艦隊戦開戦時
router.on([{url: /api_req_combined_battle\/battle/}],      Controllers.onCombinedBattleStarted);
router.on([{url: /api_req_combined_battle\/each_battle/}], Controllers.onCombinedBattleStarted);
router.on([{url: /api_req_combined_battle\/ld_airbattle/}],Controllers.onCombinedBattleStarted);

// 母校帰投
router.on([{url: /api_port\/port/}],         Controllers.onHomePort);

const WebRequestListener = router.listener();

let onCompletedRouter = new SerialRouter(3);
onCompletedRouter.on([{url: /api_req_sortie\/battleresult/}, true],          Controllers.onBattleResulted);
onCompletedRouter.on([{url: /api_req_combined_battle\/battleresult/}, true], Controllers.onCombinedBattleResulted);
onCompletedRouter.on([true, {url: /api_req_nyukyo\/start/}],                 Controllers.onRecoveryStartCompleted);
onCompletedRouter.on([true, true, {url: /api_req_kousyou\/createship/}],     Controllers.onCreateShipCompleted);

const WebRequestOnCompleteListener = onCompletedRouter.listener();

export {
  WebRequestListener,
  WebRequestOnCompleteListener
};
