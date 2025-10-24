import { Model } from "jstorm/chrome/local";

export class FileSaveConfig extends Model {
  public static readonly _namespace_ = "FileSaveConfig";

  static default = {
    "user": {
      folder: "艦これ",
      filenameTemplate: "%Y%m%d_%H%M%S.png",
    }
  };

  static async user(): Promise<FileSaveConfig> {
    return (await this.find("user"))!;
  }

  // 保存先フォルダ名 ~/Downloads/ 以下のフォルダ
  // デフォルト: "艦これ" (= "~/Downloads/艦これ")
  public folder: string = "艦これ";

  // 保存ファイル名テンプレート
  // %Y: 年(4桁), %m: 月(2桁), %d: 日(2桁), %H: 時(2桁), %M: 分(2桁), %S: 秒(2桁)
  // デフォルト: "%Y%m%d_%H%M%S.png" (例: "20240615_134501.png")
  public filenameTemplate: string = "%Y%m%d_%H%M%S.png";

  /**
   * ファイル名を生成する
   * @param date 日付オブジェクト
   * @returns 生成されたファイル名
   */
  public getFilename(date: Date): string {
    const Y = date.getFullYear().toString().padStart(4, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    const H = date.getHours().toString().padStart(2, "0");
    const M = date.getMinutes().toString().padStart(2, "0");
    const S = date.getSeconds().toString().padStart(2, "0");
    let filename = this.filenameTemplate;
    filename = filename.replace(/%Y/g, Y);
    filename = filename.replace(/%m/g, m);
    filename = filename.replace(/%d/g, d);
    filename = filename.replace(/%H/g, H);
    filename = filename.replace(/%M/g, M);
    filename = filename.replace(/%S/g, S);
    return filename;
  }
}