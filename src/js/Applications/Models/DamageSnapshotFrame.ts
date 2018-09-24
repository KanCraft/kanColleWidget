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
      height: 200,
      left: 0,
      options: [
        {name: "使わない", value: DamageSnapshotType.Disabled},
        {name: "窓内表示", value: DamageSnapshotType.InApp},
        {name: "別窓表示", value: DamageSnapshotType.Separate},
      ],
      title: "大破進撃防止窓",
      top:  0,
      type: Type.Select,
      value: "disabled",
    },
  };

  public static get(): DamageSnapshotFrame {
    return this.find<DamageSnapshotFrame>(dskey);
  }

  public value: string;
  private height: number;
  private left: number;
  private top: number;

  public createData(): chrome.windows.CreateData {
    return {
      height: this.height,
      left: this.left,
      top: this.top,
      type: "popup",
    };
  }

}
