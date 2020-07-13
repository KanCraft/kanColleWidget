import { Client } from "chomex";
import InAppButtons from "../../../../src/js/Applications/Context/Features/InAppButtons";
import Frame from "../../../../src/js/Applications/Models/Frame";

describe("アプリ内ボタン", () => {
  describe("InAppButtons", () => {
    it("TODO: アサーション", () => {
      const configs = {
        "inapp-mute-button": {value: true},
        "inapp-screenshot-button": {value: true},
      };
      const frame = new Frame({muted: false});
      new InAppButtons(window.document, configs, frame , new Client(chrome.runtime));
    });
  });
});
