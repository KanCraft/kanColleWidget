import {Model} from "chomex";

export default class Mastodon extends Model {
  static schema = {
    domain: Model.Types.string.isRequired,
  }
}
