import {Model} from "chomex";

export default class Resource extends Model {
  static nextID = Model.sequentialID
  static schema = {
    fuel:    Model.Types.number.isRequired,
    ammo:    Model.Types.number.isRequired,
    steel:   Model.Types.number.isRequired,
    bauxite: Model.Types.number.isRequired,
    buckets: Model.Types.number.isRequired,
    created: Model.Types.number.isRequired,
  }
  static list() {
    return super.list().sort((p, n) => p.created < n.created ? -1 : 1);
  }
  static last() {
    return this.list().pop();
  }
}
