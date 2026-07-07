import { expect, describe, it } from "vitest";
import { Routes, ocrResultRoute } from "../src/messages";
import { EntryType } from "../src/models/entry";

// 拡張内メッセージのルート定数（src/messages.ts）の値を、送受信の契約リテラルとして固定する。
// 定数の値が変わると送信側・受信側の実際の文字列一致が壊れるため、値を直接リテラルで比較して
// 事故的な変更を検出する。送信側実装が定数を参照する形になっても、この期待値は独立した契約として残す。
describe("メッセージルート定数の契約", () => {
  it("Routes の全定数が期待リテラルと一致する", () => {
    expect(Routes).toEqual({
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
    });
  });

  it.each([
    [EntryType.RECOVERY, "/injected/dmm/ocr/recovery:result"],
    [EntryType.SHIPBUILD, "/injected/dmm/ocr/shipbuild:result"],
  ])("ocrResultRoute(%s) は期待リテラルを返す", (purpose, expected) => {
    expect(ocrResultRoute(purpose)).toBe(expected);
  });
});
