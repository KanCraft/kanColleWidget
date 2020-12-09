import {Model} from "chomex";
import catalog from "./catalog";
import { SortieContextType } from "../Settings/SortieContextSetting";

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
      inbattle: false, // 戦闘中
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
  inbattle: boolean; // 戦闘中であるか

  /**
   * 出撃の開始
   */
  start(area: number, map: number): Sortie {
    return this.update({area, map, depth: 1});
  }

  /**
   * 戦闘の開始
   * 戦闘は2回続くことがあるので、resultもしくはnextで戦闘が終了しない限り、インクリメントしない
   */
  battle(): Sortie {
    if (this.inbattle) return this;
    return this.update({ inbattle: true, depth: this.depth + 1 });
  }

  /**
   * 戦闘の終了
   * FIXME: YAGNI.
   * そもそも`api_req_sortie/battleresult`はルーティングしていないので、現状これを呼ぶのはテストだけ
   */
  result(): Sortie {
    return this.update({ inbattle: false });
  }

  /**
   * 次のマスへ移動
   */
  next(): Sortie {
    return this.update({ inbattle: false });
  }

  /**
   * 出撃の終了（帰還）
   */
  refresh(): Sortie {
    return this.update({area: null, map: null, depth: null});
  }

  toText(type: SortieContextType, withDepth = true): string {
    if (type == SortieContextType.Disabled) return "";
    const shorttext = `${this.area}-${this.map}` + ((withDepth && this.depth) ? ` (${this.depth})` : "");
    if (type == SortieContextType.Short) return shorttext;
    try {
      const area = catalog[this.area];
      const map = area.maps[this.map];
      return ((withDepth && this.depth) ? `${this.depth}戦目/` : "") + `${map.title}/${area.title}`;
    } catch (err) {
      console.log("[DEBUG]", `海域情報がありません: 海域ID ${this.area}-${this.map}`);
      return shorttext;
    }
  }
}
