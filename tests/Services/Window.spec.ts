import WindowService from "../../src/js/Services/Window";
import { fake } from "../tools";
import DamageSnapshotFrame from "../../src/js/Applications/Models/DamageSnapshotFrame";

describe("WindowService", () => {
  describe("find", () => {
    it("窓みつけてくる", async () => {
      fake(chrome.tabs.query).callbacks([]);
      const ws = new WindowService();
      const tab = await ws.find();
      expect(tab).toBeUndefined();
    });
    it("strictだと無い場合throwします", async () => {
      fake(chrome.tabs.query).callbacks([]);
      const ws = new WindowService();
      const strict = true;
      await expect(ws.find(strict)).rejects.toBe("not found");
    });
  });

  describe("openOptionsPage", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.query).callbacks([]);
      fake(chrome.tabs.create).callbacks({active: true});
      const ws = new WindowService();
      const tab = await ws.openOptionsPage();
      expect(tab.active).toBe(true);
    });
  });

  describe("openDashboardPage", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.query).callbacks([]);
      fake(chrome.windows.create).callbacks({ tabs: [{ id: 123 }] });
      const ws = new WindowService();
      const tab = await ws.openDashboardPage();
      expect(tab.id).toBe(123);
    });
    it("あったときはfocus", async () => {
      fake(chrome.tabs.query).callbacks([{ id: 234 }]);
      fake(chrome.windows.update).callbacks({ tabs: [{ id: 234 }] });
      const ws = new WindowService();
      const tab = await ws.openDashboardPage();
      expect(tab.id).toBe(234);
    });
  });

  describe("openDeckCapturePage", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.create).callbacks({ id: 888 });
      const ws = new WindowService();
      const tab = await ws.openDeckCapturePage();
      expect(tab.id).toBe(888);
    });
  });

  describe("openDamageSnapshot", () => {
    it("なんかする", async () => {
      fake(chrome.windows.create).callbacks({ tabs: [{ id: 1234 }] });
      const ws = new WindowService();
      const frame = new DamageSnapshotFrame();
      const tab = await ws.openDamageSnapshot(frame, 1, 1, "foobaa");
      expect(tab.id).toBe(1234);
    });
  });

  describe("cleanDamageSnapshot", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.query).callbacks([{ id: 789 }]);
      const ws = new WindowService();
      await ws.cleanDamageSnapshot();
    });
  });
});
