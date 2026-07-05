import { SortieContext } from "../../models/Logbook";

// api_formation の陣形コードと表示名の対応
const FormationNames: Record<string, string> = {
  "1": "単縦陣",
  "2": "複縦陣",
  "3": "輪形陣",
  "4": "梯形陣",
  "5": "単横陣",
  "6": "警戒陣",
  "11": "第一警戒航行序列",
  "12": "第二警戒航行序列",
  "13": "第三警戒航行序列",
  "14": "第四警戒航行序列",
};

// 陣形コードを表示名にする。未知のコードはコードのまま、空は「不明」として表示する。
export function formationName(formation: string): string {
  return FormationNames[formation] ?? (formation || "不明");
}

// 出撃日時を「2026/7/5 12:34」のように簡潔に表示する
export function formatStarted(started: number): string {
  return new Date(started).toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 戦闘ごとの陣形と夜戦有無を「単縦陣 / 複縦陣(夜)」のように列挙する
export function describeBattles(sortie: SortieContext): string {
  return sortie.battles
    .map((battle) => formationName(battle.formation) + (battle.midnight ? "(夜)" : ""))
    .join(" / ");
}
