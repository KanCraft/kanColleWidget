import type { ResultSet } from "./types";

// グリッドの行数・列数の可動域
export const MinGridSize = 1;
export const MaxGridSize = 9;

/**
 * グリッドの行数・列数を変更した composition を返す
 * 既存セルのラベルは保持し、新しく増えたセルには「行-列」形式のラベルを与える
 */
export function resizeComposition(base: string[][], rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) =>
      base[rowIndex]?.[colIndex] ?? `${rowIndex + 1}-${colIndex + 1}`,
    ),
  );
}

/**
 * グリッドの行数・列数を変更した ResultSet を返す
 * 既存セルのキャプチャは保持し、新しく増えたセルは未撮影（null）にする
 */
export function resizeResultSet(base: ResultSet, rows: number, cols: number): ResultSet {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => base[rowIndex]?.[colIndex] ?? null),
  );
}
