import { useState } from "react";
import type { RelativeRect } from "../../../services/CropService";
import { getMeshStyle } from "../../fleet-capture/mesh";

interface CapturePreviewProps {
  preview: string | null;
  rect: RelativeRect;
  // 切り抜き範囲の調整中は大きく表示する
  expanded: boolean;
  onRefresh: () => void;
}

/**
 * これから撮る切り抜き範囲を示すゲーム画面のプレビュー
 */
export function CapturePreview({ preview, rect, expanded, onRefresh }: CapturePreviewProps) {
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">現在の切り抜き範囲</p>
      <div className={`relative overflow-hidden border ${expanded ? "w-[400px]" : "w-64"}`}>
        {preview ? (
          <>
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
          </>
        ) : (
          <div className="w-full aspect-[1200/720] bg-gray-200 flex items-center justify-center text-gray-600 text-sm p-4 text-center">
            ゲームウィンドウが見つかりません。ゲームを開いてから「プレビューを更新」を押してください。
          </div>
        )}
      </div>
      <button
        type="button"
        className="border rounded p-2 text-sm cursor-pointer border-slate-200 bg-slate-100"
        onClick={onRefresh}
      >
        プレビューを更新
      </button>
    </div>
  );
}
