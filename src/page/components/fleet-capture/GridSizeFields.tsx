import { MaxGridSize, MinGridSize } from "../../fleet-capture/composition";
import { NumberField } from "./NumberField";

interface GridSizeFieldsProps {
  rows: number;
  cols: number;
  onChange: (rows: number, cols: number) => void;
}

/**
 * キャプチャを並べるグリッドの行数・列数
 */
export function GridSizeFields({ rows, cols, onChange }: GridSizeFieldsProps) {
  return (
    <div className="flex items-center gap-4">
      <NumberField
        label="行数"
        value={rows}
        min={MinGridSize}
        max={MaxGridSize}
        onChange={(next) => onChange(next, cols)}
      />
      <NumberField
        label="列数"
        value={cols}
        min={MinGridSize}
        max={MaxGridSize}
        onChange={(next) => onChange(rows, next)}
      />
    </div>
  );
}
