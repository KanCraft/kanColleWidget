import QueueEntryBase from "./Base";

export class Mission extends QueueEntryBase {
  public static get type() {
    return "mission";
  }

  // カタログから来る基本情報 (idさえあればcatalogからひける)
  public id: number | string = 0; // 遠征ID
  public title: string = "UNKNOWN"; // 遠征タイトル
  public time: number = 0; // 所要時間（ミリ秒）

  // 追加のインスタンス情報
  public deck: number | string = 0; // 艦隊ID [2,3,4]
}
