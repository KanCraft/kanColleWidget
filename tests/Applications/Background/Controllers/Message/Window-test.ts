// import * as chrome from "sinon-chrome";
import { fake } from "../../../../tools";

import {
  WindowDecoration,
  WindowOpen,
  WindowRecord,
  WindowToggleMute,
} from "../../../../../src/js/Applications/Background/Controllers/Message/Window";

describe("Window Controller", () => {
  describe("WindowOpen", () => {
    fake(chrome.tabs.query).callbacks([]);
    fake(chrome.windows.create).callbacks({tabs: [ {} ] });
    it("TODO: なんかアサーションする", async (ok) => {
      await WindowOpen({});
      ok();
    });
  });

  describe("WindowDecoration", () => {
    it("TODO: なんかアサーションする", async (ok) => {
      fake(chrome.tabs.setZoom).callbacks({});
      const context = { sender: { tab: {} } };
      await WindowDecoration.bind(context)({});
      ok();
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

});
