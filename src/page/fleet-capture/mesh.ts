import type { CSSProperties } from "react";
import { Rectangle, type RelativeRect } from "../../services/CropService";

/**
 * プレビュー画像上で切り抜き範囲を示すオーバーレイのスタイルを返す
 * 巨大な box-shadow で範囲外を暗転させる（親要素の overflow-hidden で画像内に収める）
 */
export function getMeshStyle(imageSize: { w: number; h: number }, rect: RelativeRect): CSSProperties {
  const game = new Rectangle(imageSize.w, imageSize.h).game();
  return {
    left: `${((game.start.x + game.size.w * rect.x) / imageSize.w) * 100}%`,
    top: `${((game.start.y + game.size.h * rect.y) / imageSize.h) * 100}%`,
    width: `${((game.size.w * rect.w) / imageSize.w) * 100}%`,
    height: `${((game.size.h * rect.h) / imageSize.h) * 100}%`,
    boxShadow: "0 0 0 100vmax rgba(0, 0, 20, 0.6)",
  };
}
