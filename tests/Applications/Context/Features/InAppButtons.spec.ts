import { Client } from "chomex";
import InAppButtons from "../../../../src/js/Applications/Context/Features/InAppButtons";

describe("アプリ内ボタン", () => {
  describe("InAppButtons", () => {
    it("TODO: アサーション", () => {
      const configs = {
        "inapp-mute-button": {value: true},
        "inapp-screenshot-button": {value: true},
      };
      const b = new InAppButtons(window.document, configs, new Client(chrome.runtime));
    });
  });
});
