import { Model } from "chomex";
import catalog from "./catalog";

export interface DeckCaptureLike {
  _id: any;
  title: string;
  row: number; col: number; page: number;
  cell: { x: number; y: number; w: number, h: number; };
  protected?: boolean;
}

/**
 * 編成キャプチャの設定を保存する用のモデル。
 * ふつうの1艦隊編成もあれば、連合艦隊、航空基地編成などもある。
 */
export default class DeckCapture extends Model {

  static __ns = "DeckCapture";

  static default = {
    normal: {
      title: "編成キャプチャ",
      row: 3,
      col: 2,
      cell: catalog.fleet,
      protected: true,
    },
    combined: {
      title: "連合編成キャプチャ",
      row: 3,
      col: 2,
      cell: catalog.fleet,
      protected: true,
      page: 2,
      pagelabel: ["第一艦隊", "第二艦隊"],
    },
    aviation: {
      title: "基地航空隊",
      row: 1,
      col: 3,
      cell: catalog.aviation,
      protected: true,
    },
  };

  title: string; // この編成キャプチャ設定の名前
  row: number; // 列数
  col: number; // 行数
  cell: { // 1セルの定義
    x: number; // スタート座標X （ゲーム幅を1に対して）
    y: number; // スタート座標Y （ゲーム高を1に対して）
    w: number; // セル幅 （ゲーム幅を1に対して）
    h: number; // セル高 （ゲーム高を1に対して）
  };
  protected = false; // 削除禁止
  page = 1; // 繰り返しページ数
  pagelabel: string[] = []; // ページごとのラベル

  obj(): DeckCaptureLike {
    return {
      _id: this._id,
      title: this.title,
      row: this.row, col: this.col, page: this.page,
      cell: {...this.cell},
      protected: this.protected,
    };
  }

  static listObj(): DeckCaptureLike[] {
    return this.list<DeckCapture>().map(d => d.obj());
  }

}
