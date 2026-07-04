import { expect, describe, it, vi } from "vitest";

// NotificationConfig は static default の初期化で chrome.runtime.getURL を参照するため、
// import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
  };
});

import { Model } from "jstorm/chrome/local";
import { installMemoryStorage } from "jstorm/testing";

import { migrateNotificationConfig } from "../src/controllers/Runtime";
import { NotificationConfig } from "../src/models/configs/NotificationConfig";

// _namespace_ 未指定だった過去ビルドでは、NotificationConfig のテーブルが minify 後の
// 短縮クラス名（"G" や "Z" 等、ビルドごとに異なる）のキーに保存されていた。
// migrateNotificationConfig がそれらを正規キー "NotificationConfig" へ移行することを検証する。
describe("migrateNotificationConfig", () => {
  const record = (props: { [key: string]: unknown } = {}) => ({
    enabled: false,
    sound: null,
    icon: null,
    stay: false,
    ...props,
  });

  it("短縮名キーの通知設定テーブルを正規キーへ移行し、移行元を削除する", async () => {
    const area = installMemoryStorage({
      "Z": {
        "/mission/end": record({ _id: "/mission/end" }),
        "/default/start": record({ sound: "beep.mp3", _id: "/default/start" }),
      },
      "Queue": { "1": { type: "mission" } },
    });
    Model.useStorage(area);

    await migrateNotificationConfig(area);

    const all = await area.get(null);
    expect(all["Z"]).toBeUndefined();
    expect(all["NotificationConfig"]).toEqual({
      "/mission/end": record({ _id: "/mission/end" }),
      "/default/start": record({ sound: "beep.mp3", _id: "/default/start" }),
    });
    // 移行後はモデル経由でも保存済みの設定が読める
    const config = await NotificationConfig.find("/mission/end");
    expect(config?.enabled).toBe(false);
    // 通知設定と無関係のテーブルには触れない
    expect(all["Queue"]).toEqual({ "1": { type: "mission" } });
  });

  it("移行対象がなければ何もしない", async () => {
    const area = installMemoryStorage({
      "NotificationConfig": { "/mission/end": record() },
      "Queue": { "1": { type: "mission" } },
      // レコードIDの形式が一部でも合わないテーブルは通知設定とみなさない
      "X": { "/mission/end": record(), "user": { enabled: true } },
      // オブジェクト以外の値も対象外
      "Y": "not-a-table",
    });
    const before = await area.get(null);

    await migrateNotificationConfig(area);

    expect(await area.get(null)).toEqual(before);
  });

  it("正規キーに既にあるレコードは正規側を優先し、無いレコードだけ取り込む", async () => {
    const area = installMemoryStorage({
      "NotificationConfig": {
        "/mission/end": record({ enabled: true, _id: "/mission/end" }),
      },
      "G": {
        "/mission/end": record({ enabled: false, _id: "/mission/end" }),
        "/fatigue/end": record({ stay: true, _id: "/fatigue/end" }),
      },
    });

    await migrateNotificationConfig(area);

    const all = await area.get(null);
    expect(all["G"]).toBeUndefined();
    expect(all["NotificationConfig"]).toEqual({
      "/mission/end": record({ enabled: true, _id: "/mission/end" }),
      "/fatigue/end": record({ stay: true, _id: "/fatigue/end" }),
    });
  });
});
