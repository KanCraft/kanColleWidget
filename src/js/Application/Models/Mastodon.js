import {Model} from "chomex";

export default class Mastodon extends Model {
  static scheme = {
    id:            Model.Types.string.isRequired,
    name:          Model.Types.string,
    website:       Model.Types.string,
    redirect_uri:  Model.Types.string,
    client_id:     Model.Types.string.isRequired,
    client_secret: Model.Types.string.isRequired,
  }
}