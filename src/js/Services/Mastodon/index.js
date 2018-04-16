import mammut from "mammut";

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
    const client = this.accessor.find(url.host);
    if (client) {
      client.rawurl = url.href;
      client.redirect_uri = chrome.runtime.getURL("dest/html/options.html");
      return Promise.resolve(client.toMammutClient());
    }

    return this._createClient(url);
  }

  _createClient(url) {
    const instance = new mammut.Instance(url.href);
    return instance.client({
      name: CLIENT_NAME,
      redirect: chrome.runtime.getURL("dest/html/options.html"),
      scopes: ["read", "write"],
    }).then(client => {
      this.accessor.create({
        _id: url.host,
        ...client,
      });
      return Promise.resolve(client);
    });
  }
}