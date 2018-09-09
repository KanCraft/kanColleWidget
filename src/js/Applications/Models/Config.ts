import {Model} from "chomex";

export enum Type {
  Select = "select",
  Switch = "switch",
}

export enum Category {
  InApp = "inapp",
}

/**
 * どういうvalueを取るかを generics T で指定
 */
export default class Config<T> extends Model {

  public static default = {
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
  };

  public static select(keys: string[]): {[name: string]: Config<any>} {
    const all = this.all();
    const res = {};
    keys.map(key => res[key] = all[key]);
    return res;
  }

  public category: Category;
  public description: string;
  public options?: Array<{name: string, value: string}>;
  public title: string;
  public type: Type;
  public value: T;
}
