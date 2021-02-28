import ScreenshotSetting from "../../../../src/js/Applications/Models/Settings/ScreenshotSetting";
import { Clock } from "jestil";

describe("ScreenshotSetting", () => {
  describe("getFullDownloadPath", () => {
    it("スクショダウンロードのフルパスを日付を考慮して返す", () => {
      const clock = Clock.freeze("2020-07-07 22:33:44");
      const setting = ScreenshotSetting.user();
      const fullpath = setting.getFullDownloadPath();
      expect(fullpath).toBe("艦これウィジェット/スクリーンショット_20200707_2233.png");
      clock.release();
    });
  });
});