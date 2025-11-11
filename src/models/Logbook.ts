import { Model } from "jstorm/chrome/local";

export enum BattleResult {
  SS = "完全勝利S",
  S = "勝利S",
  A = "勝利A",
  B = "戦術的勝利B",
  C = "戦術的敗北C",
  D = "敗北D",
  E = "敗北E",
}

interface Battle {
  started: number;
  ended: number | null;

  cell: string; // どのマスで戦闘が起きたか
  formation: string; // 陣形
  midnight: boolean; // 夜戦したかどうか

  // ユーザがメモできる領域
  result: BattleResult | null; // リザルト
  reward: string | null; // ドロップ艦など
}

interface Cell {
  id: string; // マスIDがあるっぽい
}

class SortieContext extends Model {

  static override _namespace_ = "SortieLog";

  public started: number = Date.now();
  public deck: string | null = null;
  public map: { area: string; info: string } | null = null;

  public cells: Cell[] = [];
  public battles: Battle[] = [];

  public start(deck: string, map: { area: string; info: string }) {
    this.started = Date.now();
    this.deck = deck;
    this.map = map;
  }

  public next(cell: string) {
    this.cells.push({ id: cell });
  }

  /**
   * 戦闘ごとに呼ばれる
   * Usage:
   *  Logbook.sortie.battle.start(formation);
   */
  public battle = {
    start: (formation: string) => {
      this.battles.push({
        started: Date.now(),
        ended: null,
        cell: this.cells.length > 0 ? this.cells[this.cells.length - 1].id : "",
        formation: formation,
        result: null,
        reward: null,
        midnight: false,
      });
    },
    midnight: () =>{
      const battle = this.battles[this.battles.length - 1];
      if (battle) {
        battle.midnight = true;
      }
    },
    result: () => {
      const battle = this.battles[this.battles.length - 1];
      if (battle) {
        battle.ended = Date.now();
      }
    },
  };

}

export class Logbook {

  private static _context: SortieContext | null = null;

  /**
   * 出撃ごとに呼ばれる
   * Usage:
   *  Logbook.sortie.start(deck, map);
   */
  public static get sortie(): SortieContext {
    if (!this._context) {
      this._context = new SortieContext();
    }
    return this._context;
  }

  public static async record(): Promise<SortieContext | null> {
    if (!this._context) return null;
    this._context._id = this._context.started.toString();
    const saved = await this._context.save();
    this._context = null;
    return saved;
  }

  public static async list(): Promise<SortieContext[]> {
    return SortieContext.list();
  }
}
