import {Model} from "chomex";
import mammut from "mammut";

export default class Mastodon extends Model {

  // static scheme = {
  //   id:            Model.Types.string.isRequired,
  //   name:          Model.Types.string,
  //   website:       Model.Types.string,
  //   redirect_uri:  Model.Types.string,
  //   client_id:     Model.Types.string.isRequired,
  //   client_secret: Model.Types.string.isRequired,
  // }

  /**
   * mammut.Clientから、KanColleWidget的なModelに変換するやつ
   * @param {mammut.Client} client
   */
  static fromMammutClient(client) /* this */ {
    const url = new URL(client.rawurl);
    return new this({
      ...client,
    }, url.host);
  }

  /**
   * KanColleWidget的なModelから、mammut.Clientに変換するやつ
   */
  toMammutClient() /* mammut.Client */ {
    const config = {
      id: this.idStr,
      client_id: this.id,
      client_secret: this.secret,
      name: this.name,
      redirect_uri: this.redirectURI,
      rawurl: this.rawurl,
    };
    if (this.hasAccessToken()) {
      config.accessToken = {
        access_token: this.accessToken.token,
        token_type: this.accessToken.type,
        scope: this.accessToken.scope,
        created_at: this.accessToken.created,
      };
    }
    return new mammut.Client(config);
  }

  hasAccessToken() /* bool */ {
    if (typeof this.accessToken === "undefined") {
      return false;
    }
    return !!this.accessToken.token;
  }
}