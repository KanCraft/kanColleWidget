import DamageSnapshot from "../../../../src/js/Applications/Context/Features/DamageSnapshot";
import {fake} from "../../../tools";

describe("大破進撃防止窓のためのコンテキスト実装", () => {
  describe("DamageSnapshot", () => {
    let canvas: HTMLCanvasElement;
    beforeAll(() => {
      canvas = window.document.createElement("canvas");
      Object.defineProperty(window.document, "querySelector", { value: () => canvas});
    });
    it("ひととおりなんかする", async () => {
      fake(chrome.runtime.sendMessage).callbacks({});
      const ds = new DamageSnapshot(window);
      ds.prepare({ count: 1, key: 12345, text: "foobar" });
      canvas.dispatchEvent(new Event("mousedown"));
      ds.show({ uri: "data:image/png;base64,xxxx", height: 140 });
      canvas.dispatchEvent(new Event("mousedown"));
      ds.remove();
    });
  });
});
