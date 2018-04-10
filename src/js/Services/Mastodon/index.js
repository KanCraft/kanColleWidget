export default class MastodonService {

  constructor(accessor) {
    this.accessor = accessor;
  }

  static CLIENT_NAME = "艦これウィジェット";

  /**
   * 登録済みクライアントがローカルストレージにあればそれをサービス化して返す。
   * なければ、"/api/v1/apps"を叩いてClientトークンを取得して
   * 保存しつつ、サービスを返す。
   */
  client(instanceURL) {
    if (!/^https?:\/\//.test(instanceURL)) {
      instanceURL = "https://" + instanceURL;
    }
    const url = new URL(instanceURL);

    // hostを_idとして使う
    const mastodon = this.accessor.find(url.host);
    if (mastodon) return Promise.resolve(mastodon);

    return this._createClient(url);
  }

  _createClient(url) {
    url.pathname = "/api/v1/apps";
    const formdata = new FormData();
    formdata.append("client_name", MastodonService.CLIENT_NAME);
    formdata.append("redirect_uris", "urn:ietf:wg:oauth:2.0:oob");
    formdata.append("scopes", "read write");
    return fetch(url, {
      method: "POST",
      body: formdata,
    // }).then(res => res.json());
    }).then(res => res.json()).then(client => Promise.resolve(this.accessor.create({
      _id: url.host, // hostを_idとして使う
      ...client,
    })));
  }

  /**
   * 当該インスタンスにおけるTokenを取得する
   */
  token(instance) {

    const url = new URL("https://" + instance._id);
    url.pathname = "/oauth/token";

    const formdata = new FormData();
    formdata.append("client_id", instance.client_id);
    formdata.append("client_secret", instance.client_secret);
    formdata.append("grant_type", "password");
    formdata.append("scope", "read write");

    // TODO:
    formdata.append("username", "xxx@yyy.zzz");
    formdata.append("password", "xxxyyyzzz");

    return fetch(url, {
      method: "POST",
      body: formdata,
    }).then(res => res.json()).then(token => {
      return Promise.resolve(instance.update(token));
    });
  }
}