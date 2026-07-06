import { useState } from "react";
import type { RelativeRect } from "../../../services/CropService";
import { getMeshStyle } from "../../fleet-capture/mesh";

interface CapturePreviewThumbnailProps {
  preview: string;
  rect: RelativeRect;
}

/**
 * これから撮る切り抜き範囲を示す小さなプレビュー
 */
export function CapturePreviewThumbnail({ preview, rect }: CapturePreviewThumbnailProps) {
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">現在の切り抜き範囲</p>
      <div className="relative overflow-hidden w-64 border">
        <img
          src={preview}
          alt="キャプチャ対象のプレビュー"
          className="w-full block"
          onLoad={(event) =>
            setImageSize({
              w: event.currentTarget.naturalWidth,
              h: event.currentTarget.naturalHeight,
            })
          }
        />
        {imageSize ? (
          <div
            className="absolute border border-dashed border-yellow-400 pointer-events-none"
            style={getMeshStyle(imageSize, rect)}
          />
        ) : null}
      </div>
    </div>
  );
}
