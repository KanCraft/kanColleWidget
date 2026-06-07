import { areas } from "../catalog";

/** 海域ラベルの表記形式。 */
export type AreaLabelFormat = "number" | "japanese";

/**
 * 大破進撃防止窓に出す「海域 (連戦数)」ラベルを組み立てる純粋関数（#1764）。
 *
 * - map が null（SW 揮発などで出撃コンテキストが取れない）場合は null を返し、呼び出し側は
 *   ラベルを描画しない（従来どおり画像のみ）。
 * - 海域は番号形式 `area-info`（例 `1-1`）。format が "japanese" のときはカタログ
 *   （src/catalog/areas.json）で日本語名に変換し、未収録の海域は番号形式へフォールバックする。
 * - 連戦数は呼び出し側が `Logbook.sortie.battles.length`（= api_req_sortie/battle の発火数）
 *   を渡す。マスではなく戦闘回数で数えるのが正しいことは実データで裏取り済み（#1764 コメント参照）。
 */
export function formatSortieLabel(
  map: { area: string; info: string } | null | undefined,
  battleCount: number,
  format: AreaLabelFormat,
): string | null {
  if (!map) return null;
  const key = `${map.area}-${map.info}`;
  const area = format === "japanese" ? (areas[key] ?? key) : key;
  return `${area} (${battleCount})`;
}
