import listener from "../../../../src/js/Applications/Background/Routers/Message";

describe("Message Router", () => {
  describe("onMessage Listener", () => {
    it("chrome.runtime.onMessage.addListenerに登録するリスナーは、非同期処理を行うため必ずtrueを返すようにできてる", async () => {
      const res = await listener({id: "/screenshot"});
      expect(res).toBe(true);
    });
  });
});
