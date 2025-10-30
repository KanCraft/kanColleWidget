import { useState } from "react";
import { DamageSnapshotConfig, DamageSnapshotMode, DamageSnapshotModeDictionary } from "../../../models/configs/DamageSnapshotConfig";
import { FoldableSection } from "../FoldableSection";

export function DamageSnapshotSettingView({
  config: _config,
}: {
  config: DamageSnapshotConfig;
}) {
  const [config] = useState<DamageSnapshotConfig>(_config);
  const [mode, setMode] = useState<DamageSnapshotMode>(config.mode);

  return (
    <FoldableSection title="大破進撃防止の設定" id="damage-snapshot">
      <div className="mb-4">
        <p>戦闘終了時の艦隊を撮影し、進撃判断時に大破艦の有無を確認できるようにする機能です</p>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          <span className="font-bold">表示モード</span>
        </label>
        <select
          value={mode}
          onChange={async (e) => {
            const newMode = e.target.value as DamageSnapshotMode;
            await config.update({ mode: newMode });
            setMode(newMode);
          }}
          className="border rounded p-2 w-full max-w-md"
        >
          {Object.entries(DamageSnapshotModeDictionary).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>
    </FoldableSection>
  );
}
