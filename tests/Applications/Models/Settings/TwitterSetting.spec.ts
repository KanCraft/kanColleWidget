import TwitterSetting from "../../../../src/js/Applications/Models/Settings/TwitterSetting";

describe("TwitterSetting", () => {
  describe("user", () => {
    it("唯一の設定をとってくる", () => {
      const user = TwitterSetting.user();
      expect(user.authorized).toBeFalsy();
      const cred: any = { credential: { toJSON() { return { oauthAccessToken: "xxx", oauthTokenSecret: "xxx" }; } }, additionalUserInfo: { profile: { screen_name: "otiai10" } } };
      user.success(cred);
      expect(user.authorized).toBeTruthy();
      user.revoke();
      expect(user.authorized).toBeFalsy();
    });
  });
});