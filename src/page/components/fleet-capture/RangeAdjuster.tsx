import { useState, type CSSProperties } from "react";
import { Rectangle, type RelativeRect } from "../../../services/CropService";
import { MaxGridSize, MinGridSize } from "../../fleet-capture/composition";

interface RangeAdjusterProps {
  preview: string | null;
  rect: RelativeRect;
  rows: number;
  cols: number;
  onRectChange: (rect: RelativeRect) => void;
  onGridSizeChange: (rows: number, cols: number) => void;
  onRefreshPreview: () => void;
}

export function RangeAdjuster({
  preview,
  rect,
  rows,
  cols,
  onRectChange,
  onGridSizeChange,
  onRefreshPreview,
}: RangeAdjusterProps) {
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
  const mesh = preview && imageSize ? getMeshStyle(imageSize, rect) : null;
  return (
    <div className="flex gap-6">
      <div className="relative overflow-hidden w-[600px] shrink-0 border">
        {preview ? (
          <>
            <img
              src={preview}
              alt="ゲーム画面のプレビュー"
              className="w-full block"
              onLoad={(event) =>
                setImageSize({
                  w: event.currentTarget.naturalWidth,
                  h: event.currentTarget.naturalHeight,
                })
              }
            />
            {mesh ? <div className="absolute border border-dashed border-yellow-400 pointer-events-none" style={mesh} /> : null}
          </>
        ) : (
          <div className="w-full aspect-[1200/720] bg-gray-200 flex items-center justify-center text-gray-600 text-sm p-4 text-center">
            ゲームウィンドウが見つかりません。ゲームを開いてから「プレビューを更新」を押してください。
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold">切り抜き範囲（ゲーム画面に対する%）</h3>
          <PercentInput label="左位置" value={rect.x} onChange={(x) => onRectChange({ ...rect, x })} />
          <PercentInput label="上位置" value={rect.y} onChange={(y) => onRectChange({ ...rect, y })} />
          <PercentInput label="幅" value={rect.w} onChange={(w) => onRectChange({ ...rect, w })} />
          <PercentInput label="高さ" value={rect.h} onChange={(h) => onRectChange({ ...rect, h })} />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">グリッド構成</h3>
          <CountInput label="行数" value={rows} onChange={(next) => onGridSizeChange(next, cols)} />
          <CountInput label="列数" value={cols} onChange={(next) => onGridSizeChange(rows, next)} />
        </div>
        <button
          type="button"
          className="border rounded p-2 cursor-pointer border-slate-200 bg-slate-100"
          onClick={onRefreshPreview}
        >
          プレビューを更新
        </button>
      </div>
    </div>
  );
}

/**
 * プレビュー画像上で切り抜き範囲を示すオーバーレイのスタイルを返す
 * 巨大な box-shadow で範囲外を暗転させる（親要素の overflow-hidden で画像内に収める）
 */
function getMeshStyle(imageSize: { w: number; h: number }, rect: RelativeRect): CSSProperties {
  const game = new Rectangle(imageSize.w, imageSize.h).game();
  return {
    left: `${((game.start.x + game.size.w * rect.x) / imageSize.w) * 100}%`,
    top: `${((game.start.y + game.size.h * rect.y) / imageSize.h) * 100}%`,
    width: `${((game.size.w * rect.w) / imageSize.w) * 100}%`,
    height: `${((game.size.h * rect.h) / imageSize.h) * 100}%`,
    boxShadow: "0 0 0 100vmax rgba(0, 0, 20, 0.6)",
  };
}

function PercentInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-16">{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        step={1}
        className="border rounded p-1 w-20"
        value={Math.round(value * 100)}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
      />
    </label>
  );
}

function CountInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-16">{label}</span>
      <input
        type="number"
        min={MinGridSize}
        max={MaxGridSize}
        step={1}
        className="border rounded p-1 w-20"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
