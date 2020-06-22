import listener from "../../../../src/js/Applications/Background/Routers/WebRequestOnComplete";

describe("WebRequestOnCompleted Router", () => {
  describe("onCompleted Listener", () => {
    it("chrome.alarms.onCompleted.addListenerに登録するリスナーは、非同期処理を行うため必ずtrueを返すようにできてる", async () => {
      const res = await listener({url: "http://hoge.fuga.com"});
      expect(res).toBe(true);
    });
  });
});
