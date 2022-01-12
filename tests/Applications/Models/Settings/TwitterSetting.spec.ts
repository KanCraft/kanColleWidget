import { OAuthCredential, TwitterAuthProvider, UserCredential } from "@firebase/auth";
import TwitterSetting from "../../../../src/js/Applications/Models/Settings/TwitterSetting";

const dummyUserCred: any /* UserCredential */ = {
  providerId: "twitter.com", operationType: "signIn",
  user: {
    emailVerified: true, isAnonymous: false, metadata: {}, providerData: [], refreshToken: "", tenantId: "",
    email: "", displayName: "", phoneNumber: "", photoURL: "",  providerId: "twitter.com", uid: "",
    delete: () => Promise.resolve(), reload: () => Promise.resolve(), toJSON: () => ({}),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getIdToken: (_: boolean) => Promise.resolve(""), getIdTokenResult: (_: boolean) => Promise.resolve({} as any),
  },
  _tokenResponse: {
    providerId: "twitter.com", oauthAccessToken: "xxx", oauthTokenSecret: "zzzzz",
    rawUserInfo: JSON.stringify({}), screenName: "otiai10",
  },
};

describe("TwitterSetting", () => {
  describe("user", () => {
    it("唯一の設定をとってくる", () => {
      const user = TwitterSetting.user();
      expect(user.authorized).toBeFalsy();
      const userCred: UserCredential = dummyUserCred;
      const oauthCred: OAuthCredential = TwitterAuthProvider.credentialFromResult(userCred);
      user.success(userCred, oauthCred);
      expect(user.authorized).toBeTruthy();
      user.revoke();
      expect(user.authorized).toBeFalsy();
    });
  });
});