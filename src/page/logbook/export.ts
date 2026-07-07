import { SortieContext } from "../../models/Logbook";
import { describeBattles, formatStarted } from "./format";

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

// ダウンロードファイル名用のタイムスタンプ（例: 20260707_153000）
function filenameTimestamp(date: Date): string {
  const Y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const H = pad2(date.getHours());
  const M = pad2(date.getMinutes());
  const S = pad2(date.getSeconds());
  return `${Y}${m}${d}_${H}${M}${S}`;
}

export function logbookExportFilename(extension: "csv" | "jsonl", date: Date = new Date()): string {
  return `出撃記録_${filenameTimestamp(date)}.${extension}`;
}

function csvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

const CSV_HEADER = ["出撃日時", "艦隊", "海域", "戦闘数", "戦闘"];

// 出撃記録一覧の表示列と同じ内容をCSVにする（1行1出撃）
export function toCSV(sorties: SortieContext[]): string {
  const rows = sorties.map((sortie) => [
    formatStarted(sortie.started),
    sortie.deck ?? "",
    sortie.map ? `${sortie.map.area}-${sortie.map.info}` : "",
    String(sortie.battles.length),
    describeBattles(sortie),
  ]);
  return [CSV_HEADER, ...rows].map((row) => row.map(csvField).join(",")).join("\r\n") + "\r\n";
}

// SortieContext には battle() 等のメソッドを積んだ battle プロパティが乗っているため、
// そのまま JSON.stringify せずデータ項目だけを抜き出す
export function toJSONL(sorties: SortieContext[]): string {
  return sorties.map((sortie) => JSON.stringify({
    id: sortie._id,
    started: sortie.started,
    deck: sortie.deck,
    map: sortie.map,
    cells: sortie.cells,
    battles: sortie.battles,
  })).join("\n") + "\n";
}

export function toDataUrl(content: string, mimeType: string): string {
  return `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
}
