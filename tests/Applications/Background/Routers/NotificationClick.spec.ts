import listener from "../../../../src/js/Applications/Background/Routers/NotificationClick";

describe("NotificationClick Router", () => {
  describe("onClicked Listener", () => {
    it("chrome.notifications.onClicked.addListenerに登録するリスナーは、非同期処理を行うため必ずtrueを返すようにできてる", async () => {
      const res = await listener({id: "Mission"});
      expect(res).toBe(true);
    });
  });
});
