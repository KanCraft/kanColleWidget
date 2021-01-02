import { Model } from "chomex";

export default class TwitterSetting extends Model {

  // {{{ OAuth
  screenName: string;
  profileImageUrlHttps: string;
  accessToken: string;
  tokenSecret: string;
  // }}}

  // {{{ Settings
  displayOfficialTwitter: boolean;
  // }}}

  static user(): TwitterSetting {
    return this.find("user") || new TwitterSetting({}, "user");
  }
  get authorized(): boolean {
    return !!(this.screenName && this.accessToken && this.tokenSecret);
  }
  success(cred: firebase.default.auth.UserCredential): TwitterSetting {
    const credential = cred.credential.toJSON();
    return this.update({
      screenName: cred.additionalUserInfo.username || cred.additionalUserInfo.profile["screen_name"],
      profileImageUrlHttps: cred.additionalUserInfo.profile["profile_image_url_https"],
      accessToken: credential["oauthAccessToken"],
      tokenSecret: credential["oauthTokenSecret"],
    });
  }
  revoke(): TwitterSetting {
    return this.update({screenName: "", profileImageUrlHttps: "", accessToken: "", tokenSecret: ""});
  }

}