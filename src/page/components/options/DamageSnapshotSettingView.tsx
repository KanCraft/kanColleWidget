import { useState } from "react";
import { DamageSnapshotConfig, DamageSnapshotMode, DamageSnapshotModeDictionary } from "../../../models/configs/DamageSnapshotConfig";
import type { AreaLabelFormat } from "../../../models/sortieLabel";
import { FoldableSection } from "../FoldableSection";

export function DamageSnapshotSettingView({
  config: _config,
}: {
  config: DamageSnapshotConfig;
}) {
  const [config] = useState<DamageSnapshotConfig>(_config);
  const [mode, setMode] = useState<DamageSnapshotMode>(config.mode);
  const [heightRatio, setHeightRatio] = useState<number>(config.heightRatio);
  const [areaLabelFormat, setAreaLabelFormat] = useState<AreaLabelFormat>(config.areaLabelFormat ?? "number");
  const [keepUntilNextShow, setKeepUntilNextShow] = useState<boolean>(config.keepUntilNextShow ?? false);

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

      {mode === DamageSnapshotMode.INAPP && (
        <div className="mb-4">
          <label className="block mb-2">
            <span className="font-bold">表示サイズ（画面縦幅比）</span>
            <span className="ml-2 text-sm text-gray-600">{heightRatio}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="60"
            value={heightRatio}
            onChange={async (e) => {
              const newHeightRatio = Number(e.target.value);
              await config.update({ heightRatio: newHeightRatio });
              setHeightRatio(newHeightRatio);
            }}
            className="w-full max-w-md"
          />
          <div className="flex justify-between text-xs text-gray-500 max-w-md mt-1">
            <span>10%</span>
            <span>40% (標準)</span>
            <span>60%</span>
          </div>
        </div>
      )}

      {mode !== DamageSnapshotMode.DISABLED && (
        <div className="mb-4">
          <label className="block mb-2">
            <span className="font-bold">海域名の表記</span>
          </label>
          <select
            value={areaLabelFormat}
            onChange={async (e) => {
              const next = e.target.value as AreaLabelFormat;
              await config.update({ areaLabelFormat: next });
              setAreaLabelFormat(next);
            }}
            className="border rounded p-2 w-full max-w-md"
          >
            <option value="number">番号で表示（例: 1-1 (2)）</option>
            <option value="japanese">日本語名で表示（例: 鎮守府正面海域 (2)）</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">大破進撃防止窓に「海域 (連戦数)」を表示します。日本語名が未収録の海域は番号で表示されます。</p>
        </div>
      )}

      {mode !== DamageSnapshotMode.DISABLED && (
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={keepUntilNextShow}
              onChange={async (e) => {
                const next = e.target.checked;
                await config.update({ keepUntilNextShow: next });
                setKeepUntilNextShow(next);
              }}
            />
            <span className="font-bold">次の窓が出るまで前の窓を消さない</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">通常は次の戦闘開始時に前の大破確認窓を消しますが、ONにすると次の窓が表示されるまで前の窓を残します（母港に戻ると消えます）。</p>
        </div>
      )}
    </FoldableSection>
  );
}
