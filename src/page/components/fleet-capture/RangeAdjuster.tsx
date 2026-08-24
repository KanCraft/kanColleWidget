import { type RelativeRect } from "../../../services/CropService";
import { NumberField } from "./NumberField";

interface RangeAdjusterProps {
  rect: RelativeRect;
  onRectChange: (rect: RelativeRect) => void;
}

/**
 * ゲーム描画領域に対する切り抜き範囲を%で指定する
 */
export function RangeAdjuster({ rect, onRectChange }: RangeAdjusterProps) {
  return (
    <div className="space-y-1">
      <h3 className="font-semibold">切り抜き範囲（ゲーム画面に対する%）</h3>
      <PercentField label="左位置" value={rect.x} onChange={(x) => onRectChange({ ...rect, x })} />
      <PercentField label="上位置" value={rect.y} onChange={(y) => onRectChange({ ...rect, y })} />
      <PercentField label="幅" value={rect.w} onChange={(w) => onRectChange({ ...rect, w })} />
      <PercentField label="高さ" value={rect.h} onChange={(h) => onRectChange({ ...rect, h })} />
      <p className="text-sm text-gray-600">数値の上でマウスホイールを回しても増減できます。</p>
    </div>
  );
}

function PercentField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <NumberField
      label={label}
      value={Math.round(value * 100)}
      min={0}
      max={100}
      onChange={(percent) => onChange(percent / 100)}
      labelWidthClass="w-16"
    />
  );
}
