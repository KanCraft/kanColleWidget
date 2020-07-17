import { Client } from "chomex";
import InAppButtons from "../../../../src/js/Applications/Context/Features/InAppButtons";
import Frame from "../../../../src/js/Applications/Models/Frame";
import {fake} from "../../../tools";

describe("InAppButtons", () => {
  describe("ひととおり", () => {
    let container: HTMLDivElement;
    beforeAll(() => {
      container = window.document.createElement("div");
      Object.defineProperty(window.document, "querySelector", { value: () => container });
    });

    it("なんかする", () => {
      fake(chrome.runtime.sendMessage).callbacks({ data: { mutedInfo: {} } });
      const frame = new Frame({muted: false});
      const ctx = new InAppButtons(window.document, { mute: true, screenshot: true }, frame, new Client(chrome.runtime));
      const [mute, screenshot] = Array.from(ctx.container.querySelectorAll("button"));
      container.dispatchEvent(new Event("mouseover"));
      container.dispatchEvent(new Event("mouseout"));
      mute.click();
      screenshot.click();
    });
  });
});
