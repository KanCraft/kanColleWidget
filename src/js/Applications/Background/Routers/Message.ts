/**
 * chrome.runtime.sendMessage を
 * background.js で扱うためのルーティングを定義します。
 */
import {Router} from "chomex";

import {
  Screenshot,
} from "../Controllers/Message/Capture";
import {
  DamageSnapshotCapture,
} from "../Controllers/Message/DamageSnapshot";
import {
  DebugController,
} from "../Controllers/Message/Debug";
import {
  WindowDecoration,
  WindowOpen,
  WindowRecord,
  WindowToggleMute,
} from "../Controllers/Message/Window";

const router = new Router();
router.on("/window/open",              WindowOpen);
router.on("/window/decoration",  WindowDecoration);
router.on("/window/record",          WindowRecord);
router.on("/window/toggle-mute", WindowToggleMute);

// スクショとか
router.on("/capture/screenshot", Screenshot);

// 大破進撃防止窓
router.on("/snapshot/capture", DamageSnapshotCapture);

// デバッグ用コントローラ。おもに設定画面の「Dev Debugger」から呼ばれる。
router.on("/debug/controller", DebugController);

export default router.listener();
