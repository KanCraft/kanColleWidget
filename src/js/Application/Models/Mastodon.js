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

  toMammutClient() /* mammut.Client */ {
    // console.log("これを", this);
    // console.log("mammut.Clientにしていく");
    return new mammut.Client({
      id: this.idStr,
      client_id: this.id,
      client_secret: this.secret,
      name: this.name,
      redirect_uri: this.redirect_uri,
      rawurl: this.rawurl,
    });
  }
}