import { UserConfig } from "./UserConfig";

// スクリーンショットの保存画像フォーマット
// chrome.tabs.captureVisibleTab の format に渡せる値と一致させる
export type ImageFormat = "png" | "jpeg";

// 既定値の単一定義。static default（未保存時のレコード）と
// プロパティ初期値（保存済みレコードに無いフィールドの補完）は必ずここから導出する。
const DEFAULTS = {
  askAlways: false,
  folder: "艦これ",
  filenameTemplate: "%Y%m%d_%H%M%S",
  format: "png" as ImageFormat,
  editBeforeSave: false,
};

export class FileSaveConfig extends UserConfig {
  static override readonly _namespace_ = "FileSaveConfig";

  static override default = {
    "user": { ...DEFAULTS },
  };

  // 保存前に毎回ファイル保存先を指定すべきか
  // chrome.downloads API の saveAs オプションに対応
  public askAlways: boolean = DEFAULTS.askAlways;

  // 保存先フォルダ名 ~/Downloads/ 以下のフォルダ
  // デフォルト: "艦これ" (= "~/Downloads/艦これ")
  public folder: string = DEFAULTS.folder;

  // 保存ファイル名テンプレート（拡張子なし、拡張子は format から付与される）
  // %Y: 年(4桁), %m: 月(2桁), %d: 日(2桁), %H: 時(2桁), %M: 分(2桁), %S: 秒(2桁)
  // デフォルト: "%Y%m%d_%H%M%S" (例: "20240615_134501.png")
  public filenameTemplate: string = DEFAULTS.filenameTemplate;

  // 保存画像フォーマット。ファイル名の拡張子もこれに従う
  public format: ImageFormat = DEFAULTS.format;

  // 撮影後すぐダウンロードせず、編集ページを開いてそこの保存操作でダウンロードするか
  public editBeforeSave: boolean = DEFAULTS.editBeforeSave;

  /**
   * filenameTemplate 末尾に拡張子を含む設定を、拡張子なしテンプレートと format の組に
   * 移行して保存し直す。format 導入以前の設定は拡張子込みテンプレートだったため、その互換処理。
   * @returns 移行後（または移行不要ならそのまま）の設定
   */
  protected override async migrate(): Promise<FileSaveConfig> {
    const matched = this.filenameTemplate.match(/\.(png|jpe?g)$/i);
    if (!matched) return this;
    const format: ImageFormat = matched[1].toLowerCase() === "png" ? "png" : "jpeg";
    return await this.update({
      filenameTemplate: this.filenameTemplate.slice(0, -matched[0].length),
      format,
    });
  }

  /**
   * ファイル名を生成する（拡張子込み）
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
    return `${filename}.${this.format}`;
  }
}
