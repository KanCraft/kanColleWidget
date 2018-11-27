import {Model} from "chomex";
import catalog from "./catalog";

/**
 * 出撃における、今が何戦目なのかを記録するモデル
 */
/* tslint:disable object-literal-sort-keys */
export default class Sortie extends Model {

  public static default = {
    context: {
      area: null,  // 海域
      map: null,  // マップ
      depth: null, // 何戦目
    },
  };

  public static context(): Sortie {
    return this.find("context");
  }

  // これがここにあるのが正しいのかよくわからない
  private static officialTitle: string = "艦隊これくしょん -艦これ- - オンラインゲーム - DMM GAMES";

  public area: number; // 海域 e.g. 「南西諸島海域」（２）
  public map: number; // マップ e.g. 「東部オリョール海」（３）
  public depth: number; // 何戦目か

  /**
   * 出撃の開始
   */
  public start(area: number, map: number): Sortie {
    return this.update({area, map, depth: 0});
  }

  /**
   * 戦闘の開始
   */
  public battle(): Sortie {
    return this.update({depth: this.depth + 1});
  }

  /**
   * 戦闘の終了
   */
  public result(): Sortie {
    // 今んとこ何もしない
    return this;
  }

  /**
   * 出撃の終了（帰還）
   */
  public refresh(): Sortie {
    return this.update({area: null, map: null, depth: null});
  }

  public toText(): string {
    const fallback = `A: ${this.area}, I ${this.map}, D: ${this.depth}`;
    const area = catalog[this.area];
    if (!area) {
      return fallback;
    }
    const map = area.maps[this.map];
    if (!map) {
      return fallback;
    }
    return `${this.depth}戦目/${map.title}/${area.title}`;
  }

}
