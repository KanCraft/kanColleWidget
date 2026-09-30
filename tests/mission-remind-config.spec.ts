import { expect, describe, it, vi } from "vitest";

// NotificationConfig の static default が chrome.runtime.getURL を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
  };
});

import { NotificationConfig } from "../src/models/configs/NotificationConfig";
import { NotificationService } from "../src/services/NotificationService";
import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";
import { TriggerType } from "../src/models/entry";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

restoreDefaultsBeforeEach(NotificationConfig);

// 遠征帰投予告（#935）は既定で使わない。/default/remind は持たず、完了時のデフォルトを参照する。
describe("遠征帰投予告の設定", () => {
  it("/mission/remind の設定が保存されていなくても落ちずに解決し、既定は無効", async () => {
    const config = await NotificationConfig.get("/mission/remind/2");
    expect(config.enabled).toBe(false);
  });

  it("有効にすると、未設定の項目は完了時のデフォルトを引く", async () => {
    await NotificationConfig.new({ enabled: true, sound: null, icon: null, stay: null }, "/mission/remind").save();
    await (await NotificationConfig.user(TriggerType.END)).update({ stay: true });
    const config = await NotificationConfig.get("/mission/remind/2");
    expect(config.enabled).toBe(true);
    expect(config.stay).toBe(true);
  });

  it("既定では notifyRaw が通知を作らない", async () => {
    const mod = { getAll: vi.fn(), clear: vi.fn(), create: vi.fn() } as unknown as typeof chrome.notifications;
    const sound = { play: vi.fn() } as unknown as ConstructorParameters<typeof NotificationService>[1];
    const id = await new NotificationService(mod, sound).notifyRaw("/mission/remind/2", "/mission/remind/2", () => ({
      type: "basic", iconUrl: "", title: "", message: "",
    }));
    expect(id).toBe("");
    expect(mod.create).not.toHaveBeenCalled();
  });

  it("予告の分数は既定3分で、選択肢にない保存値は3分として扱う", async () => {
    expect(new BehaviorConfig().normalizedMissionRemindMinutes()).toBe(3);
    const config = new BehaviorConfig();
    config.missionRemindMinutes = 7;
    expect(config.normalizedMissionRemindMinutes()).toBe(3);
    config.missionRemindMinutes = 15;
    expect(config.normalizedMissionRemindMinutes()).toBe(15);
  });
});
