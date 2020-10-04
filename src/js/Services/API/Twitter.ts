import OAuthSimple from "oauthsimple";
import TwitterSetting from "../../Applications/Models/Settings/TwitterSetting";

interface UserCredential {
  accessToken: string;
  tokenSecret: string;
}

interface Consumer {
  key: string;
  secret: string;
}

export interface User {
  name: string;
  screen_name: string;
  profile_image_url_https: string;
}

export interface Status {
  created_at: string;
  id_str: string;
  text: string;
  user: User;
}

declare const TWITTER_CONFIG: Consumer;

export default class TwitterAPI {
  constructor(
    private credential: UserCredential = TwitterSetting.user(),
    private consumer: Consumer = TWITTER_CONFIG,
  ) {}

  async getOfficialTweets(count = 5): Promise<Status[]> {
    const oauth = OAuthSimple(this.consumer.key, this.consumer.secret);
    const request = oauth.sign({
      action: "GET",
      path: "https://api.twitter.com/1.1/statuses/user_timeline.json",
      parameters: {
        screen_name: "KanColle_STAFF",
        count,
      },
      signatures: {
        oauth_token: this.credential.accessToken,
        oauth_secret : this.credential.tokenSecret,
      }
    });
    const res = await fetch(request.signed_url);
    return res.json();
  }
}