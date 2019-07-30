
import {SerialRouter} from "chomex";
import { OnBattleResulted, OnCombinedBattleResulted } from "../Controllers/Request/Battle";
import { OnRecoveryStartCompleted } from "../Controllers/Request/Recovery";
import { OnShipbuildingStartCompleted } from "../Controllers/Request/Shipbuilding";

const resolver = (detail) => {
    // host部分を削除したものをrouting nameとして使う
    return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};

const router = new SerialRouter(2, resolver);

router.on(["api_req_sortie/battleresult"], OnBattleResulted);
router.on(["api_req_combined_battle/battleresult"], OnCombinedBattleResulted);
router.on([true, "api_req_nyukyo/start"], OnRecoveryStartCompleted);
router.on([true, "api_req_kousyou/createship"], OnShipbuildingStartCompleted);

export default router.listener();
