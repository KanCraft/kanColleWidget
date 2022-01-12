import { Model } from "chomex";
import auth, { getAdditionalUserInfo } from "firebase/auth";

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
  success(user: auth.UserCredential, oauth: auth.OAuthCredential): TwitterSetting {
    const info = getAdditionalUserInfo(user);
    return this.update({
      screenName: info.username || info.profile["screen_name"],
      profileImageUrlHttps: info.profile["profile_image_url_https"],
      accessToken: oauth.accessToken,
      tokenSecret: oauth.secret,
    });
  }
  revoke(): TwitterSetting {
    return this.update({screenName: "", profileImageUrlHttps: "", accessToken: "", tokenSecret: ""});
  }

}