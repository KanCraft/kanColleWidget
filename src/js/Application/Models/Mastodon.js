import {Model} from "chomex";

export default class Mastodon extends Model {
  static schema = {
    name: Model.Types.string.isRequired,
    url:  Model.Types.string.isRequired,
  }
}
