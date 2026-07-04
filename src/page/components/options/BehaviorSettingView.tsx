import { useState } from "react";
import { BehaviorConfig } from "../../../models/configs/BehaviorConfig";
import { FoldableSection } from "../FoldableSection";

export function BehaviorSettingView({
  config: _config,
}: {
  config: BehaviorConfig;
}) {
  const [config] = useState<BehaviorConfig>(_config);
  const [restackFatigueOnSortie, setRestackFatigueOnSortie] = useState<boolean>(config.restackFatigueOnSortie ?? false);

  return (
    <FoldableSection title="細かい挙動設定" id="behavior">
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={restackFatigueOnSortie}
            onChange={async (e) => {
              const next = e.target.checked;
              await config.update({ restackFatigueOnSortie: next });
              setRestackFatigueOnSortie(next);
            }}
            className="w-4 h-4"
          />
          <span className="font-bold">出撃時に同じ艦隊の疲労タイマーを積み直す</span>
        </label>
        <div className="text-sm text-gray-600 mt-1">
          オフ（既定）では出撃するたびに疲労タイマーが並びます（連続出撃の回数把握に使えます）。オンでは同じ艦隊の古いタイマーを削除して最新の1本だけにします。
        </div>
      </div>
    </FoldableSection>
  );
}
