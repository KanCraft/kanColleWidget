/**
 * chrome.runtime.sendMessage を
 * background.js で扱うためのルーティングを定義します。
 */
import {Router} from "chomex";

import {
  WindowOpen,
  WindowDecoration,
} from "../Controllers/Window";

const router = new Router();
router.on("/window/open",             WindowOpen);
router.on("/window/decoration", WindowDecoration);

export default router.listener();
