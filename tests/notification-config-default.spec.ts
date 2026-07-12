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

// static default のキー集合は jstorm の find() フォールバックの根拠となる。1文字でも欠けると
// 保存済み設定が読めなくなるため、直積生成の結果を固定キー集合として検証する。
describe("NotificationConfig.default のキー集合", () => {
  it("/default/{start,end} + 4種別×2 + /quest-alert/start の11キーちょうどを持つ", () => {
    const keys = Object.keys(NotificationConfig.default!).sort();
    expect(keys).toEqual([
      "/default/end",
      "/default/start",
      "/fatigue/end",
      "/fatigue/start",
      "/mission/end",
      "/mission/start",
      "/quest-alert/start",
      "/recovery/end",
      "/recovery/start",
      "/shipbuild/end",
      "/shipbuild/start",
    ]);
  });

  it("直積で生成した各レコードは共有参照でなく独立オブジェクトである", () => {
    const def = NotificationConfig.default!;
    expect(def["/mission/start"]).not.toBe(def["/mission/end"]);
    expect(def["/mission/start"]).not.toBe(def["/recovery/start"]);
    expect(def["/mission/start"]).toEqual({ enabled: true, sound: null, icon: null, stay: false });
  });
});

// get() は id をパースして設定を引くが、trigger が不正なときは END に、type を解析できないときは
// default のみにフォールバックする。この挙動を保つことを検証する。
describe("NotificationConfig.get のフォールバック", () => {
  it("trigger が TriggerType 外なら END の設定を引く", async () => {
    // /mission/end だけに区別可能な値(stay:true)を保存し、END 経由で引かれることを確認する
    await NotificationConfig.new({ enabled: true, sound: null, icon: null, stay: true }, "/mission/end").save();

    const bogus = await NotificationConfig.get("/mission/bogus/2");
    expect(bogus.stay).toBe(true); // END の /mission/end を引いた

    const start = await NotificationConfig.get("/mission/start/2");
    expect(start.stay).toBe(false); // START はデフォルトのまま
  });

  it("2セグメントの設定キーIDもそのまま引ける", async () => {
    const config = await NotificationConfig.get("/quest-alert/start");
    expect(config.enabled).toBe(true);
  });

  it("パースできないIDでは default（END）のみを参照して落ちない", async () => {
    const config = await NotificationConfig.get("");
    expect(config.enabled).toBe(true);
    // /default/end のアイコン（getURL 由来）にフォールバックする
    expect(config.icon).toBe("chrome-extension://test/icons/128.png");
  });
});
