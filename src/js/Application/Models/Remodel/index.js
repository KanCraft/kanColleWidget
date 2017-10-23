/**
 * これModels以下に置いていいのか？という気持ちはありつつ
 * だって、chomex.Model継承してないんだもん
 */

export default class Remodel {
  static catalog = require("./catalog.json");
  static filter(fn = () => true) {
    return this.catalog.records.filter(fn);
  }
  static categories(asArray = false) {
    const dict = this.catalog.records.reduce((self, record) => {self[record.category] = true; return self;}, {});
    return asArray ? Object.keys(dict) : dict;
  }
}
