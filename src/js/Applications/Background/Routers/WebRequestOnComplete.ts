
import {SerialRouter} from "chomex";
import { onBattleResulted } from "../Controllers/onRequestCompleted";

const resolver = (detail) => {
  // host部分を削除したものをrouting nameとして使う
  return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};

const router = new SerialRouter(2, resolver);

router.on([
  "api_req_sortie/battleresult",
], onBattleResulted);

export default router.listener();
