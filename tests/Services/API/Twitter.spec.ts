import TwitterAPI from "../../../src/js/Services/API/Twitter";
import { Fetch } from "../../tools";

declare let global: any;
describe("TwitterAPI", () => {
  global.TWITTER_CONFIG = { key: "xxx", secret: "xxx" };
  describe("getOfficialTweets", () => {
    it("なんかとってくる", async () => {
      // Fetch.replies([{text: "hello"}]);
      // TODO: GitHub上に独自のDatabaseを用意するので、そこをGETするようにする.
      const api = new TwitterAPI();
      const statuses = await api.getOfficialTweets();
      expect(statuses.length).toBe(0);
    });
  });
  describe("uploadSingleImage", () => {
    it("なんかする", async () => {
      Fetch.replies({});
      const api = new TwitterAPI();
      api.uploadSingleImage(new Blob());
    } );
  });
  describe("postTweetWithMedia", () => {
    it("なんかする", async () => {
      Fetch.replies({});
      const api = new TwitterAPI();
      api.postTweetWithMedia("test");
    } );
  });
});