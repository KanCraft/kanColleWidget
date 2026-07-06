import type { CapturePreset } from "../../../models/CapturePreset";

interface PresetSelectorProps {
  presets: CapturePreset[];
  selectedId: string;
  onSelect: (presetId: string) => void;
}

export function PresetSelector({ presets, selectedId, onSelect }: PresetSelectorProps) {
  return (
    <select
      value={selectedId}
      onChange={(event) => onSelect(event.target.value)}
      className="border p-2 rounded"
    >
      {presets.map((preset) => (
        <option key={preset._id} value={preset._id!}>
          {preset.name}
        </option>
      ))}
    </select>
  );
}
