// import * as chrome from "sinon-chrome";
import {when} from "../../../../tools";

import {
  WindowDecoration,
  WindowOpen,
  WindowRecord,
  WindowToggleMute,
} from "../../../../../src/js/Applications/Background/Controllers/Message/Window";

describe("Window Controller", () => {
  describe("WindowOpen", () => {
    when(chrome.tabs.query).callbacks([]);
    when(chrome.windows.create).callbacks({tabs: [ {} ] });
    it("TODO: なんかアサーションする", async (ok) => {
      await WindowOpen({});
      ok();
    });
  });

  describe("WindowDecoration", () => {
    it("TODO: なんかアサーションする", async (ok) => {
      const context = { sender: { tab: {} } };
      await WindowDecoration.bind(context)({});
      ok();
    });
  });

  describe("WindowRecord", () => {
    it("TODO: なんかアサーションする", async (ok) => {
      when(chrome.windows.get).callbacks({});
      const context = { sender: { tab: {} } };
      await WindowRecord.bind(context)({frame: {id: "small"}});
      ok();
    });
  });

  describe("WindowToggleMute", () => {
    it("TODO: なんかアサーションする", async (ok) => {
      when(chrome.tabs.update).callbacks({});
      const context = { sender: { tab: { mutedInfo: { muted: false } } } };
      await WindowToggleMute.bind(context)({});
      ok();
    });
  });

});
