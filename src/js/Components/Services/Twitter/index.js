import _config from './twitter-config.json';

// ChromeExOAuth is installed by "manifest.json"
// import ChromeExOAuth from '../../../../../oauth/chrome_ex_oauth';

class Twitter {

  static _instance = null;
  static sharedInstance() {
    if (!this._instance) {
      this._instance = this.init();
    }
    return this._instance;
  }
  static init(config = _config) {
    var oauth = ChromeExOAuth.initBackgroundPage(config);
    return new this(oauth);
  }

  constructor(oauth /* ChromeExOAuth */) {
    this.oauth = oauth;
  }

  auth(refresh = true) {
    if (refresh) this.oauth.clearTokens();
    return new Promise((resolve, reject) => {
      // ChromeExOAuth.authorizeは、プロジェクトルートのchrome_ex_oauth.htmlを開きます
      // TODO: chrome_ex_oauth.htmlをdest/oauth以下に移動できないだろうか
      // TODO: chrome_ex_oauth.htmlをもうちょっとかわいくしたいんだよな
      this.oauth.authorize((/* token, secret */) => {
        resolve(/* {token, secret} */);
      })
    })
  }

  getProfile() {
    var url = "https://api.twitter.com/1.1/account/verify_credentials.json";
    return this.request("GET", url);
  }

  request(method, url, data) {
    return new Promise((resolve, reject) => {
      if (!this.oauth.hasToken()) return reject();
      this.oauth.sendSignedRequest(
        url,
        (res) => {
          try {
            let data = JSON.parse(res);
            if (data.errors && data.errors.length) return reject();
            else resolve(data);
          } catch (err) { reject(err); }
        },
        {method, method}
      );
    })
  }
}

export default Twitter;
