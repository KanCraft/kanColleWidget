import { UserConfig } from "./UserConfig";

// 既定値の単一定義。static default（未保存時のレコード）と
// プロパティ初期値（保存済みレコードに無いフィールドの補完）は必ずここから導出する。
const DEFAULTS = {
  alertBeforeClose: true,
  showMuteButton: true,
  showScreenshotButton: true,
  // 既定は小(4vw)。Issue #1763「ボタンを縮小」に沿い、ORIGINAL 窓(1200px)では現行の 48px と同等の見た目。
  buttonSize: 50,
  // ポップアップで最後に選択（起動）した Frame の id を記憶し、次回の初期選択にする（#1236）。
  // 既定は "__memory__"（従来挙動）。指定 Frame が存在しない場合は表示側で MEMORY にフォールバックする。
  lastSelectedFrameId: "__memory__",
};

export class GameWindowConfig extends UserConfig {
  static override readonly _namespace_ = "GameWindowConfig";
  static override default = {
    "user": { ...DEFAULTS },
  };
  public alertBeforeClose: boolean = DEFAULTS.alertBeforeClose;
  public showMuteButton: boolean = DEFAULTS.showMuteButton;
  public showScreenshotButton: boolean = DEFAULTS.showScreenshotButton;
  public buttonSize: number = DEFAULTS.buttonSize;
  public lastSelectedFrameId: string = DEFAULTS.lastSelectedFrameId;
}
