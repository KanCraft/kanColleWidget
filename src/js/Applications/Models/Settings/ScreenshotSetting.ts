import { Model } from "chomex";

/**
 * スクショ関係の設定を保存するモデル
 */
export enum ScreenshotAction {
  OpenPage = "open", // スクショ編集画面をひらく（デフォルト）
  Download = "download", // 直接バックグラウンドでダウンロードする
}

/**
 * 画像のフォーマット
 */
export enum ImageFormat {
  PNG = "png",
  JPEG = "jpeg",
}

export default class ScreenshotSetting extends Model {
  static __ns = "ScreenshotSetting";
  static default = {
    "user": {
      action: ScreenshotAction.OpenPage,
      folder: "艦これウィジェット",
      format: ImageFormat.PNG,
      filename: "スクリーンショット_yyyyMMdd_HHmm",
      skipPage: false,
    },
  };

  // スクショしたあとのアクション
  action: ScreenshotAction;
  // ~/Downloads/ 以下のフォルダ名
  folder: string;
  format: ImageFormat;
  filename: string;
  // 編集画面を開かずにダウンロードする
  skipPage: boolean;

  // 1エンティティモデルなので
  static user(): ScreenshotSetting {
    return this.find("user");
  }

  getFullDownloadPath(filename?: string): string {
    return [this.folder, this.getFullFileName(filename)].join("/");
  }
  private getFullFileName(filename?: string): string {
    const now = new Date();
    return now.format(filename || this.filename) + "." + this.format;
  }
}