import { useEffect, useRef, useState } from "react";
import { type RelativeRect } from "../../../services/CropService";
import { MaxGridSize, MinGridSize } from "../../fleet-capture/composition";
import { getMeshStyle } from "../../fleet-capture/mesh";

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
        <p className="text-sm text-gray-600">数値の上でマウスホイールを回しても増減できます。</p>
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
 * 入力欄の上でのホイール操作を「値の増減」に割り当てる
 * React の onWheel は passive 登録で preventDefault が効かないため、
 * DOM に直接 non-passive リスナーを張ってページスクロールへの貫通を止める
 */
function useWheelAdjust(onAdjust: (direction: 1 | -1) => void) {
  const callbackRef = useRef(onAdjust);
  callbackRef.current = onAdjust;
  const targetRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;
    const listener = (event: WheelEvent) => {
      event.preventDefault();
      callbackRef.current(event.deltaY < 0 ? 1 : -1);
    };
    element.addEventListener("wheel", listener, { passive: false });
    return () => element.removeEventListener("wheel", listener);
  }, []);
  return targetRef;
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
  const percent = Math.round(value * 100);
  const inputRef = useWheelAdjust((direction) => onChange((percent + direction) / 100));
  return (
    <label className="flex items-center gap-2">
      <span className="w-16">{label}</span>
      <input
        ref={inputRef}
        type="number"
        min={0}
        max={100}
        step={1}
        className="border rounded p-1 w-20"
        value={percent}
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
  const inputRef = useWheelAdjust((direction) => onChange(value + direction));
  return (
    <label className="flex items-center gap-2">
      <span className="w-16">{label}</span>
      <input
        ref={inputRef}
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
