import { expect, describe, it, vi } from "vitest";

// Queue の import 連鎖（logger 経由の chromite）がモジュール読み込み時に chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
  };
});

import Queue from "../src/models/Queue";
import { EntryType, Mission, TriggerType } from "../src/models/entry";
import { missions } from "../src/catalog";

// 手動登録した遠征タイマーの通知に表示する名前の扱い。
describe("手動登録の遠征タイマーの表示名", () => {
  it("カタログに遠征ID 0（手動登録用の名前）が収録されている", () => {
    expect(missions["0"].title).toBe("マニュアル登録されたやつ");
  });

  it("手動登録のQueue（カタログID 0 スタンプ付き）の完了通知に名前が入る", () => {
    // Dashboard の手動登録（QueuesView）が作る params と同じ形
    const q = Queue.new({
      type: EntryType.MISSION,
      scheduled: Date.now(),
      params: { deck: 2, dock: 2, id: 0, title: missions["0"].title },
    });
    const options = q.entry<Mission>().$n.options(TriggerType.END);
    expect(options.message).toContain("第2艦隊");
    expect(options.message).toContain("「マニュアル登録されたやつ」");
  });

  it("title を持たないQueue（過去に保存された手動登録等）は「知らないやつ」にフォールバックする", () => {
    const q = Queue.new({
      type: EntryType.MISSION,
      scheduled: Date.now(),
      params: { deck: 3 },
    });
    const options = q.entry<Mission>().$n.options(TriggerType.END);
    expect(options.message).toContain("「知らないやつ」");
    expect(options.message).not.toContain("undefined");
  });
});
