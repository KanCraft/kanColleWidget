import {Model} from "chomex";
import catalog from "./catalog";

/**
 * 出撃における、今が何戦目なのかを記録するモデル
 */
/* tslint:disable object-literal-sort-keys */
export default class Sortie extends Model {

  static __ns = "Sortie";

  static default = {
    context: {
      area: null,  // 海域
      map: null,  // マップ
      depth: null, // 何戦目
    },
  };

  static context(): Sortie {
    return this.find("context");
  }

  // これがここにあるのが正しいのかよくわからない
  private static officialTitle = "艦隊これくしょん -艦これ- - オンラインゲーム - DMM GAMES";

  area: number; // 海域 e.g. 「南西諸島海域」（２）
  map: number; // マップ e.g. 「東部オリョール海」（３）
  depth: number; // 何戦目か

  /**
   * 出撃の開始
   */
  start(area: number, map: number): Sortie {
    return this.update({area, map, depth: 0});
  }

  /**
   * 戦闘の開始
   */
  battle(): Sortie {
    return this.update({depth: this.depth + 1});
  }

  /**
   * 戦闘の終了
   */
  result(): Sortie {
    // 今んとこ何もしない
    return this;
  }

  /**
   * 出撃の終了（帰還）
   */
  refresh(): Sortie {
    return this.update({area: null, map: null, depth: null});
  }

  toText(withDepth = true): string {
    const fallback = `海域:${this.area}/航路:${this.map}` + (withDepth ? `/戦闘:${this.depth}` : "");
    const area = catalog[this.area];
    if (!area) {
      return fallback;
    }
    const map = area.maps[this.map];
    if (!map) {
      return fallback;
    }
    return (withDepth ? `${this.depth}戦目/` : "") + `${map.title}/${area.title}`;
  }

}
