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
  DamageSnapshotRecord,
} from "../Controllers/Message/DamageSnapshot";
import {
  DebugAvailables,
  DebugController,
} from "../Controllers/Message/Debug";
import {
  OpenDeckCapturePage,
  OpenOptionsPage,
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

// 設定画面
router.on("/options/open", OpenOptionsPage);

// 編成キャプチャ
router.on("/deckcapture/open", OpenDeckCapturePage);

// スクショとか
router.on("/capture/screenshot", Screenshot);

// 大破進撃防止窓
router.on("/snapshot/capture", DamageSnapshotCapture);
router.on("/snapshot/record",  DamageSnapshotRecord);

// デバッグ用コントローラ。おもに設定画面の「Dev Debugger」から呼ばれる。
router.on("/debug/controller", DebugController);
router.on("/debug/availables", DebugAvailables);

export default router.listener();
