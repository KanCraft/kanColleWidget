import {ScreenshotCommand} from "../../../../src/js/Applications/Background/Controllers/Command";
import { fake } from "../../../tools";
describe("ScreenshotCommand", () => {
  fake(chrome.tabs.query).callbacks([{}]);
  fake(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxx");
  fake(chrome.storage.local.get).callbacks({});
  fake(chrome.storage.local.set).callbacks({});
  it("なんかする", async () => {
    await ScreenshotCommand();
  });
});
