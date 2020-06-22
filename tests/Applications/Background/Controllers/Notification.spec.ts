import { OnNotificationClick } from "../../../../src/js/Applications/Background/Controllers/Notification";
import {fake} from "../../../tools";

describe("OnNotificationClick", () => {
  it("なんかする", async (done) => {
    fake(chrome.notifications.clear).callbacks({});
    fake(chrome.tabs.sendMessage).callbacks({});
    fake(chrome.tabs.query).callbacks([{ id: 12345 }]);
    fake(chrome.windows.create).callbacks({tabs:[]});
    fake(chrome.windows.update).callbacks({});
    fake(chrome.tabs.update).callbacks({});
    await OnNotificationClick("Test");
    done();
  });
});