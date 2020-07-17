import WindowService from "../../src/js/Services/Window";
import { fake } from "../tools";
import DashboardFrame from "../../src/js/Applications/Models/DashboardFrame";
import Frame from "../../src/js/Applications/Models/Frame";

describe("WindowService", () => {
  describe("find", () => {
    it("窓みつけてくる", async () => {
      fake(chrome.tabs.query).callbacks([]);
      const ws = new WindowService();
      const tab = await ws.find();
      expect(tab).toBeUndefined();
      await ws.find(false, {url: "https://github.com/"});
    });
    it("strictだと無い場合throwします", async () => {
      fake(chrome.tabs.query).callbacks([]);
      const ws = new WindowService();
      const strict = true;
      await expect(ws.find(strict)).rejects.toBe("not found");
    });
  });

  describe("reconfigure", () => {
    it("なんかする", async () => {
      fake(chrome.windows.update).callbacks({});
      const ws = new WindowService();
      const tab: chrome.tabs.Tab = {
        id: 123, index: 1, pinned: false, highlighted: false, windowId: 12345, active: false,
        incognito: false, selected: false, discarded: false, autoDiscardable: false,
      };
      await ws.reconfigure(tab, new Frame());
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
      const frame = DashboardFrame.user();
      const tab = await ws.openDashboardPage(frame);
      expect(tab.id).toBe(123);
    });
    it("あったときはfocus", async () => {
      fake(chrome.tabs.query).callbacks([{ id: 234 }]);
      fake(chrome.windows.update).callbacks({ tabs: [{ id: 234 }] });
      const ws = new WindowService();
      const frame = DashboardFrame.user();
      const tab = await ws.openDashboardPage(frame);
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
      const tab = await ws.openDamageSnapshot({ height: 100, left: 20, top: 20 }, 1, 1, "foobaa");
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

  describe("openCapturePage", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.create).callbacks({});
      const ws = new WindowService();
      await ws.openCapturePage({ key: "test" });
    });
  });

  describe("openOptionPage", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.create).callbacks({});
      fake(chrome.tabs.update).callbacks({});
      const ws = new WindowService();
      fake(chrome.tabs.query).callbacks([]);
      await ws.openOptionsPage();
      fake(chrome.tabs.query).callbacks([{ id: 123 }]);
      await ws.openOptionsPage();
    });
  });

  describe("backToGame", () => {
    it("なんかする", async () => {
      fake(chrome.windows.create).callbacks({ tabs: [{}] });
      fake(chrome.windows.update).callbacks({});
      fake(chrome.tabs.update).callbacks({});
      fake(chrome.tabs.sendMessage).callbacks({});
      const ws = new WindowService();
      fake(chrome.tabs.query).callbacks([]);
      await ws.backToGame({id: "small"});
      fake(chrome.tabs.query).callbacks([{ id: 123 }]);
      await ws.backToGame({id: "small"});
    });
  });
});
