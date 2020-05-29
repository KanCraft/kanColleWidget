import listener from "../../../../src/js/Applications/Background/Routers/Alarms";

describe("Alarms Router", () => {
  describe("onAlarm Listener", () => {
    it("chrome.alarms.onAlarm.addListenerに登録するリスナーは、非同期処理を行うため必ずtrueを返すようにできてる", async () => {
      let res = await listener({id: "/screenshot"});
      expect(res).toBe(true);
      res = await listener({id: "/xxxxx"});
      expect(res).toBe(true);
    });
  });
});
