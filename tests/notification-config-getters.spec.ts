import { expect, describe, it, vi } from "vitest";

// NotificationConfig は static default の初期化で chrome.runtime.getURL を参照するため、
// import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
  };
});

import { NotificationConfig } from "../src/models/configs/NotificationConfig";
import { EntryType, TriggerType } from "../src/models/entry";

// 設定レコードの _id から type / trigger セグメントを取り出す getter の契約を検証する。
// ビュー側はこの getter に依存して _id の分解知識を持たない設計のため、
// フォールバック（解析不能→UNKNOWN / trigger 不正→END）も含めて固定する。
describe("NotificationConfig の type / trigger getter", () => {
  it("設定キー形式の _id から type と trigger を取り出す", () => {
    const config = NotificationConfig.new({}, "/shipbuild/start");
    expect(config.type).toBe(EntryType.SHIPBUILD);
    expect(config.trigger).toBe(TriggerType.START);
  });

  it("EntryType 外の type セグメント（quest-alert）もそのまま返す", () => {
    const config = NotificationConfig.new({}, "/quest-alert/start");
    expect(config.type).toBe("quest-alert");
    expect(config.trigger).toBe(TriggerType.START);
  });

  it("解析できない _id では type は UNKNOWN、trigger は END にフォールバックする", () => {
    const config = NotificationConfig.new({});
    expect(config.type).toBe(EntryType.UNKNOWN);
    expect(config.trigger).toBe(TriggerType.END);
  });

  it("trigger セグメントが TriggerType 外の値なら END にフォールバックする", () => {
    const config = NotificationConfig.new({}, "/mission/bogus");
    expect(config.trigger).toBe(TriggerType.END);
  });
});
