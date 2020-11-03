import DownloadService from "../../src/js/Services/Download";
import { fake } from "../tools";

describe("DownloadService", () => {
  describe("ひととおり", () => {
    it("なんかする", async () => {
      fake(chrome.downloads.download).callbacks(1111);
      await DownloadService.new().download({url: "xxx"});
    });
  });
});
