import { OnNotificationClick } from "../../../../src/js/Applications/Background/Controllers/Notification";
import {fake} from "../../../tools";

describe("OnNotificationClick", () => {
  it("なんかする", async (done) => {
    fake(chrome.notifications.clear).callbacks({});
    fake(chrome.runtime.sendMessage).callbacks({});
    fake(chrome.tabs.query).callbacks([]);
    fake(chrome.windows.create).callbacks({tabs:[]});
    await OnNotificationClick("Test");
    done();
  });
});