/**
 * chrome.runtime.sendMessage を
 * background.js で扱うためのルーティングを定義します。
 */
import {Router} from "chomex";

import {
  WindowDecoration,
  WindowOpen,
  WindowRecord,
} from "../Controllers/Window";

const router = new Router();
router.on("/window/open",             WindowOpen);
router.on("/window/decoration", WindowDecoration);
router.on("/window/record",         WindowRecord);

export default router.listener();
