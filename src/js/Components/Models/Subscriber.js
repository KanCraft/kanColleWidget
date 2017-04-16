import {Model} from "chomex";

export default class Subscriber extends Model {
  static schema = {
    extID:   Model.Types.string.isRequired,
    created: Model.Types.number.isRequired,
    label:   Model.Types.string,// optional
  }
}
