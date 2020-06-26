// import { Model } from "chomex";
import Config, {Category, Type} from "./Config";

export enum DamageSnapshotType {
  Disabled = "disabled",
  InApp = "inapp",
  Separate = "separate",
}

const dskey = "last";
/**
 * 大破進撃防止窓の設定を貯めるところ
 * 大破進撃防止窓は、毎戦闘後に現れて、ウィンドウの場所・サイズの変更を記録するため
 * localStorageへのアクセスが多く、別モデルとして定義してます。
 * まぁ、chomex.ModelはべつにACIDを保証しないので、これやる意味がどんくらいあるかわからんけど。
 */
// FIXME: これ問題ありそうだが
export default class DamageSnapshotFrame extends Config<any> {

  static __ns = "DamageSnapshotFrame";

  static default = {
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

  static get(): DamageSnapshotFrame {
    return this.find<DamageSnapshotFrame>(dskey);
  }

  value: string;
  private size: {height: number};
  private position: {
    left: number;
    top: number;
  };

  createData(): chrome.windows.CreateData {
    return {
      height: this.size ? this.size.height : 200,
      left: this.position ? this.position.left : 10,
      top: this.position ? this.position.top : 10,
      type: "popup",
    };
  }

}
