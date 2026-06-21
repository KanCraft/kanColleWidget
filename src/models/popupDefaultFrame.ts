// ポップアップの初期選択 Frame を解決するロジック（#1236）。
// 「最後に選択（起動）した Frame を次回の初期選択にする」を実現するが、保存していた Frame が
// 削除されている等で現在の一覧に無い場合は MEMORY にフォールバックする。
// loader (src/page/**) は coverage 除外なので、テスト可能な純粋関数としてここに切り出している。

export const MEMORY_FRAME_ID = "__memory__";

/**
 * 保存された既定 Frame id が現在の Frame 一覧に存在すればそれを返し、
 * 存在しなければ MEMORY（`__memory__`）にフォールバックする。
 *
 * @param frameIds 現在選択肢として並ぶ Frame の id 一覧
 * @param savedId  前回ポップアップで選択（起動）した Frame の id
 */
export function resolveDefaultFrameId(frameIds: string[], savedId: string): string {
  return frameIds.includes(savedId) ? savedId : MEMORY_FRAME_ID;
}
