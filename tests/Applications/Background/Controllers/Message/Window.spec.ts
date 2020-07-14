// import * as chrome from "sinon-chrome";
import { fake } from "../../../../tools";

import {
  WindowDecoration,
  WindowOpen,
  WindowRecord,
  WindowToggleMute,
  OpenOptionsPage,
  OpenDeckCapturePage,
  OpenDashboardPage,
} from "../../../../../src/js/Applications/Background/Controllers/Message/Window";

describe("Window Controller", () => {
  describe("WindowOpen", () => {
    fake(chrome.tabs.query).callbacks([]);
    fake(chrome.windows.create).callbacks({tabs: [ {} ] });
    fake(chrome.tabs.update).callbacks({});
    it("TODO: なんかアサーションする", async (ok) => {
      await WindowOpen({ id: "mini" });
      ok();
    });
  });

  describe("WindowDecoration", () => {
    it("TODO: なんかアサーションする", async () => {
      fake(chrome.tabs.setZoom).callbacks({});
      const context = { sender: { tab: {} } };
      await WindowDecoration.bind(context)({});
    });
  });

  describe("WindowRecord", () => {
    it("TODO: なんかアサーションする", async (ok) => {
      fake(chrome.windows.get).callbacks({});
      const context = { sender: { tab: {} } };
      await WindowRecord.bind(context)({frame: {id: "small"}});
      ok();
    });
  });

  describe("WindowToggleMute", () => {
    it("TODO: なんかアサーションする", async (ok) => {
      fake(chrome.tabs.update).callbacks({});
      const context = { sender: { tab: { mutedInfo: { muted: false } } } };
      await WindowToggleMute.bind(context)({});
      ok();
    });
  });

  describe("OpenOptionsPage", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.query).callbacks([]);
      fake(chrome.tabs.create).callbacks({});
      fake(chrome.tabs.update).callbacks({});
      await OpenOptionsPage();
    });
  });
  describe("OpenDeckCapturePage", () => {
    it("なんかする", async () => {
      fake(chrome.windows.create).callbacks({});
      await OpenDeckCapturePage();
    });
  });
  describe("OpenDashboardPage", () => {
    it("なんかする", async () => {
      fake(chrome.tabs.query).callbacks([]);
      fake(chrome.windows.create).callbacks({tabs: [{}]});
      await OpenDashboardPage();
    });
  });
});
