import { useState } from "react";
import { DashboardConfig } from "../../../models/configs/DashboardConfig";
import { FoldableSection } from "../FoldableSection";

export function DashboardSettingView({
  config: _config,
}: {
  config: DashboardConfig;
}) {
  const [config] = useState<DashboardConfig>(_config);

  return (
    <FoldableSection title="ダッシュボードの設定" id="dashboard">
      <div className="mb-4">
        <p>ダッシュボード窓を開く際のサイズと位置を設定できます.</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block mb-2">
            <span className="font-bold">横幅 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.width}
            onChange={async (e) => {
              await config.update({ width: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="600"
            min="200"
          />
        </div>

        <div>
          <label className="block mb-2">
            <span className="font-bold">縦幅 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.height}
            onChange={async (e) => {
              await config.update({ height: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="400"
            min="150"
          />
        </div>

        <div>
          <label className="block mb-2">
            <span className="font-bold">左位置 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.left}
            onChange={async (e) => {
              await config.update({ left: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block mb-2">
            <span className="font-bold">上位置 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.top}
            onChange={async (e) => {
              await config.update({ top: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="100"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 mt-4">
        <div>※ 設定は次回ダッシュボードを開く際に反映されます</div>
      </div>
    </FoldableSection>
  );
}
