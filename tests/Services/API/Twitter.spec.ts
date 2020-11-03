import TwitterAPI from "../../../src/js/Services/API/Twitter";
import { Fetch } from "../../tools";
jest.mock("oauthsimple");

declare let global: any;
describe("TwitterAPI", () => {
  global.TWITTER_CONFIG = { key: "xxx", secret: "xxx" };
  describe("getOfficialTweets", () => {
    it("なんかとってくる", async () => {
      Fetch.replies([{text: "hello"}]);
      const api = new TwitterAPI();
      const statuses = await api.getOfficialTweets();
      expect(statuses.length).toBe(1);
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