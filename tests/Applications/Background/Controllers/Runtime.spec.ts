import {
  OnInstalled,
} from "../../../../src/js/Applications/Background/Controllers/Runtime";
import {fake} from "../../../tools";
import KanColleServerSetting from "../../../../src/js/Applications/Models/Settings/KanColleServerSetting";

describe("RuntimeOnInstalled", () => {
  it("なんかする", async () => {
    KanColleServerSetting.user().update({servers: []});
    fake(chrome.permissions.contains).callbacks(false);
    await OnInstalled();
    KanColleServerSetting.user().update({ servers: [{ name: "test", address: "192.168.0.1" }] });
    await OnInstalled();
    fake(chrome.permissions.contains).callbacks(true);
    await OnInstalled();
  });
});