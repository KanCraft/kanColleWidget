import { useEffect, useRef } from "react";

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  // 縦に並べるときに入力欄の左端を揃えるためのラベル幅
  labelWidthClass?: string;
}

/**
 * ホイール操作でも増減できる整数入力
 */
export function NumberField({
  label,
  value,
  min,
  max,
  onChange,
  labelWidthClass = "",
}: NumberFieldProps) {
  const inputRef = useWheelAdjust((direction) => onChange(value + direction));
  return (
    <label className="flex items-center gap-2">
      <span className={labelWidthClass}>{label}</span>
      <input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        step={1}
        className="border rounded p-1 w-20"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
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
