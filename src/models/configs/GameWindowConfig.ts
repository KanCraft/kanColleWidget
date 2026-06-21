import { Model } from "jstorm/chrome/local";

export class GameWindowConfig extends Model {
  static override _namespace_ = "GameWindowConfig";
  static override default = {
    "user": {
      alertBeforeClose: true,
      showMuteButton: true,
      showScreenshotButton: true,
      // 既定は小(4vw)。Issue #1763「ボタンを縮小」に沿い、ORIGINAL 窓(1200px)では現行の 48px と同等の見た目。
      buttonSize: 50,
      // ポップアップで最後に選択（起動）した Frame の id を記憶し、次回の初期選択にする（#1236）。
      // 既定は "__memory__"（従来挙動）。指定 Frame が存在しない場合は表示側で MEMORY にフォールバックする。
      lastSelectedFrameId: "__memory__",
    },
  }
  public static async user(): Promise<GameWindowConfig> {
    return (await GameWindowConfig.find("user"))!;
  }
  public alertBeforeClose: boolean = true;
  public showMuteButton: boolean = true;
  public showScreenshotButton: boolean = true;
  public buttonSize: number = 50;
  public lastSelectedFrameId: string = "__memory__";
}
