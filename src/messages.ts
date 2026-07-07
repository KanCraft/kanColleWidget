// 拡張内メッセージ（chrome.runtime / chrome.tabs.sendMessage）のルート文字列とペイロード型を一元化する。
//
// content script (src/injection/*) からは import type のみで参照すること。
// 実行時 import を書くと複数エントリ間の共有チャンクが生成され、chrome.scripting.executeScript で
// classic script として注入される dist/dmm.js / dist/osapi.js が ESM import を含んで壊れる。
// content script 側ではローカル定数に Route<K> 型注釈を付けて Routes との一致を tsc に検査させる。

import type { Page } from "tesseract.js";
import type { EntryType } from "./models/entry";

// 拡張内メッセージのルート識別子。値は送信側・受信側で共有する単一の真実源。
export const Routes = {
  DMM_RETOUCH: "/injected/dmm/retouch",
  DMM_OCR: "/injected/dmm/ocr",
  DSNAPSHOT_PREPARE: "/injected/kcs/dsnapshot:prepare",
  DSNAPSHOT_SHOW: "/injected/kcs/dsnapshot:show",
  DSNAPSHOT_REMOVE: "/injected/kcs/dsnapshot:remove",
  DSNAPSHOT_SEPARATE_PUSH: "/dsnapshot/separate:push",
  FRAME_OPEN_OR_FOCUS: "/frame/open-or-focus",
  FRAME_MEMORY_TRACK: "/frame/memory:track",
  DASHBOARD_TRACK: "/dashboard:track",
  MUTE_TOGGLE: "/mute:toggle",
  SCREENSHOT: "/screenshot",
  DAMAGE_SNAPSHOT_CAPTURE: "/damage-snapshot/capture",
  CONFIGS: "/configs",
  SOUND_PLAY: "/sound/play",
} as const;

export type Route<K extends keyof typeof Routes> = typeof Routes[K];

// OCR依頼・結果のルートは入渠(RECOVERY)・建造(SHIPBUILD)ごとに枝分かれする。
export type OcrPurpose = EntryType.RECOVERY | EntryType.SHIPBUILD;
export type OcrResultRoute = `${typeof Routes.DMM_OCR}/${OcrPurpose}:result`;
export const ocrResultRoute = (purpose: OcrPurpose): OcrResultRoute => `${Routes.DMM_OCR}/${purpose}:result`;

// ルートごとのペイロード型。__action__ は含めず、送信側で __action__ と合わせて使う。
export interface DsnapshotPreparePayload {
  count: number;
  timestamp: number;
}

export interface DsnapshotShowPayload {
  uri: string;
  timestamp: number;
  heightRatio?: number;
  label?: string | null;
}

export interface DsnapshotSeparatePushPayload {
  uri: string;
  timestamp: number;
  label?: string | null;
}

export type DmmOcrPayload<P extends OcrPurpose> = { url: string; purpose: P } & { [K in P]: { dock: string } };

export type OcrResultPayload<P extends OcrPurpose> = { data: Page; purpose: P } & { [K in P]: { dock: string } };

export interface FrameMemoryTrackPayload {
  position: { left: number; top: number };
  size: { width: number; height: number };
}

export interface DashboardTrackPayload {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface DamageSnapshotCapturePayload {
  after: number;
  timestamp: number;
}

export interface FrameOpenOrFocusPayload {
  frame_id?: string;
}

export interface SoundPlayPayload {
  url: string;
}
