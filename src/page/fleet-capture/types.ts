import type { CapturePreset } from "../../models/CapturePreset";
import type { RelativeRect } from "../../services/CropService";

export type ResultSet = (string | null)[][];

export interface FleetCaptureController {
  presets: CapturePreset[];
  activePreset: CapturePreset;

  // 編集中の切り抜き範囲とグリッド構成（プリセットの値を初期値とする作業コピー）
  rect: RelativeRect;
  composition: string[][];

  // 編集中の値がプリセットの保存値と異なるか
  modified: boolean;

  // 範囲調整用のゲーム画面プレビュー（未取得なら null）
  preview: string | null;

  results: ResultSet;

  selectPreset: (presetId: string) => void;
  setRect: (rect: RelativeRect) => void;
  setGridSize: (rows: number, cols: number) => void;
  refreshPreview: () => Promise<void>;
  captureCell: (rowIndex: number, colIndex: number) => Promise<void>;
  updatePreset: () => Promise<void>;
  saveAsNewPreset: () => Promise<void>;
  deletePreset: () => Promise<void>;
  exportResults: () => Promise<void>;
  isExportDisabled: boolean;
}

export function createEmptyResultSet(composition: string[][]): ResultSet {
  return composition.map((row) => row.map(() => null));
}
