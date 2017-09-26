import {Model} from "chomex";

export default class Counter extends Model {
  static scheme = {
    label: Model.Types.string.isRequired,
    count: Model.Types.number.isRequired,
  }
  static template = {
    count: 0,
  }
}
