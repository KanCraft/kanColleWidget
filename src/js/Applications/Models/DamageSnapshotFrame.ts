import { Model } from "chomex";
import {Category, Type} from "./Config";

export enum DamageSnapshotType {
  Disabled = "disabled",
  InApp = "inapp",
  Separate = "separate",
}

const dskey = "last";
/**
 * 大破進撃防止窓の設定を貯めるところ
 */
export default class DamageSnapshotFrame extends Model {

  public static default = {
    [dskey]: {
      category: Category.InApp,
      description: "戦闘終了時の艦隊状況を撮影し、次の戦闘開始時まで表示し続けます。窓内表示を選択した場合、表示された艦隊状況はマウスオーバーで非表示にできます",
      options: [
        {name: "使わない", value: DamageSnapshotType.Disabled},
        {name: "窓内表示", value: DamageSnapshotType.InApp},
        {name: "別窓表示", value: DamageSnapshotType.Separate},
      ],
      position: {
        left: 0,
        top: 0,
      },
      size: {
        height: 200,
      },
      title: "大破進撃防止窓",
      type: Type.Select,
      value: "disabled",
    },
  };

  public static get(): DamageSnapshotFrame {
    return this.find<DamageSnapshotFrame>(dskey);
  }

  public value: string;
  private size: {height: number};
  private position: {
    left: number;
    top: number;
  };

  public createData(): chrome.windows.CreateData {
    return {
      height: this.size ? this.size.height : 200,
      left: this.position ? this.position.left : 10,
      top: this.position ? this.position.top : 10,
      type: "popup",
    };
  }

}
