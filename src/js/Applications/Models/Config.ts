/* tslint:disable object-literal-sort-keys */
import {Model} from "chomex";

export enum Type {
  Select = "select",
  Switch = "switch",
  Number = "number",
}

export enum Category {
  DamageSnapshot = "damagesnapshot",
  InApp = "inapp",
  Notification = "notification",
}

/**
 * どういうvalueを取るかを generics T で指定
 */
export default class Config<T> extends Model {

  static __ns = "Config";

  static default: any = {

    // 大破進撃防止機能関係 (Category = DamageSnapshot)
    "inapp-dsnapshot-size": {
      category: Category.DamageSnapshot,
      description: "大破進撃防止表示を「窓内表示」にした場合、表示の大きさを、ゲーム領域の高さに対する%で指定できます" ,
      range: [10, 50],
      step: 1,
      title: "窓内大破進撃防止表示のサイズ",
      type: Type.Number,
      value: 25,
    },
    "inapp-dsnapshot-context": {
      category: Category.DamageSnapshot,
      description: "大破進撃防止表示内に「今何戦目」みたいなテキストを含める",
      title: "出撃コンテキスト表示",
      type: Type.Switch,
      value: false,
    },

    // ゲーム内ボタン表示 (Category = InApp)
    "inapp-buttons-position": {
      category: Category.InApp,
      description: "ゲーム画面に以下の便利ボタンを表示する場合の位置を選べます（今は右上しかないけど、今後要望があれば）",
      options: [
        {name: "右上", value: "right-top"},
      ],
      title: "ゲーム画面ボタンのポジション",
      type: Type.Select,
      value: "right-top",
    },
    "inapp-mute-button": {
      category: Category.InApp,
      description: "ゲーム画面に一発ミュート/ミュート解除できるボタンを表示します",
      title: "ゲーム画面ミュートボタンを表示する",
      type: Type.Switch,
      value: false,
    },
    "inapp-screenshot-button": {
      category: Category.InApp,
      description: "ゲーム画面に一発でスクショできるボタンを表示します",
      title: "ゲーム画面スクショボタンを表示する",
      type: Type.Switch,
      value: false,
    },

    // 通知設定 (Category = Notification)
    "notification-mission": {
      category: Category.Notification,
      description: "遠征の出撃と帰還時に通知を表示します",
      title: "遠征タイマーを通知する",
      type: Type.Switch,
      value: true,
    },
    "notification-recovery": {
      category: Category.Notification,
      description: "入渠の開始と終了時に通知を表示します",
      title: "入渠タイマーを通知する",
      type: Type.Switch,
      value: true,
    },
    "notification-shipbuilding": {
      category: Category.Notification,
      description: "建造完了時に通知を表示します",
      title: "建造タイマーを通知する",
      type: Type.Switch,
      value: true,
    },
  };

  static select(keys: string[]): {[name: string]: Config<any>} {
    const all = this.all();
    const res = {};
    keys.map(key => res[key] = all[key]);
    return res;
  }

  category: Category;
  description: string;
  options?: {name: string; value: string}[];
  title: string;
  type: Type;
  value: T;

  // Numberのとき
  // TODO: ジェネリクスによって持ってるメンバの定義を変えれる？
  step?: number;
  range?: number[];
}
