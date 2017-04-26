import {Model} from "chomex";

export default class Resource extends Model {
  static nextID = Model.sequentialID
  static schema = {
    fuel:    Model.Types.number.isRequired,
    ammo:    Model.Types.number.isRequired,
    steel:   Model.Types.number.isRequired,
    bauxite: Model.Types.number.isRequired,
    buckets: Model.Types.number.isRequired,
    material:Model.Types.number.isRequired,
    created: Model.Types.number.isRequired,
  }
  static list() {
    return super.list().sort((p, n) => p.created < n.created ? -1 : 1);
  }
  static last() {
    return this.list().pop();
  }
  toText() {
    return [
      `燃料: ${this.fuel}`,
      `弾薬: ${this.ammo}`,
      `鋼材: ${this.steel}`,
      `ボーキサイト: ${this.bauxite}`,
      `修復材: ${this.buckets}`,
      `開発材: ${this.material}`,
      `#資源記録 ${(new Date(this.created)).format("yyyy/MM/dd")}`,
    ].join("\n");
  }
}
