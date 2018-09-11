/**
 * chrome.runtime.sendMessage を
 * background.js で扱うためのルーティングを定義します。
 */
import {Router} from "chomex";

import {
  WindowDecoration,
  WindowOpen,
  WindowRecord,
  WindowToggleMute,
} from "../Controllers/Window";

const router = new Router();
router.on("/window/open",              WindowOpen);
router.on("/window/decoration",  WindowDecoration);
router.on("/window/record",          WindowRecord);
router.on("/window/toggle-mute", WindowToggleMute);

export default router.listener();
