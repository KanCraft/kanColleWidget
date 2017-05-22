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
  static filter(fn) {
    return super.filter(fn).sort((p, n) => p.created < n.created ? -1 : 1);
  }
  static first() {
    return this.list().shift();
  }
  static last() {
    return this.list().pop();
  }
  // FIXME: なんかこれかっこわるいなあ
  static round(resources) {
    return resources.reduce((self, r) => {
      if (self.length == 0) return self.concat([r]);
      (self[self.length - 1]._date() == r._date()) ? self[self.length - 1] = r : self.push(r);
      return self;
    }, []);
  }
  _date() {
    const d = new Date(this.created);
    return d.getMonth() + "_" + d.getDate();
  }
  toText(fmt = false) {
    const exp = fmt ? {digit:1000,unit:"k"} : null;
    return [
      `修復材: ${this.buckets} / 開発材: ${this.material}`,
      `燃料: ${this._k("fuel", exp)} / 鋼材: ${this._k("steel", exp)}`,
      `弾薬: ${this._k("ammo", exp)} / ボーキサイト: ${this._k("bauxite", exp)}`,
      "#資源記録\n",
    ].join("\n");
  }
  _k(key, expression) {
    const v = this[key];
    if (!expression) return v;
    if (v < expression.digit) return v;
    return Math.round(v/expression.digit) + expression.unit;
  }
}
