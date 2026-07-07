import { useState } from "react";
import { BehaviorConfig, QueueWatchIntervalOptions, QueueWatchIntervalSeconds } from "../../../models/configs/BehaviorConfig";
import { FoldableSection } from "../FoldableSection";

export function BehaviorSettingView({
  config: _config,
}: {
  config: BehaviorConfig;
}) {
  const [config] = useState<BehaviorConfig>(_config);
  const [restackFatigueOnSortie, setRestackFatigueOnSortie] = useState<boolean>(config.restackFatigueOnSortie ?? false);
  const [queueWatchIntervalSeconds, setQueueWatchIntervalSeconds] = useState<QueueWatchIntervalSeconds>(config.normalizedQueueWatchIntervalSeconds());
  const [logbookRetentionDays, setLogbookRetentionDays] = useState<number>(
    config.logbookRetentionDays ?? BehaviorConfig.DEFAULT_LOGBOOK_RETENTION_DAYS,
  );

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
      <div className="mb-4">
        <label className="block mb-2">
          <span className="font-bold">タイマーの監視間隔</span>
        </label>
        <select
          value={queueWatchIntervalSeconds}
          onChange={async (e) => {
            const next = Number(e.target.value) as QueueWatchIntervalSeconds;
            await config.update({ queueWatchIntervalSeconds: next });
            setQueueWatchIntervalSeconds(next);
          }}
          className="border rounded p-2"
        >
          {QueueWatchIntervalOptions.map((seconds) => (
            <option key={seconds} value={seconds}>
              {seconds}秒
            </option>
          ))}
        </select>
        <div className="text-sm text-gray-600 mt-1">
          遠征・入渠・建造などのタイマーの期限を確認する間隔です。短くするほど予定時刻に近いタイミングで通知されますが、30秒より短い間隔では拡張機能が休止できなくなるため、バッテリー消費がわずかに増えます。ノートPCなど電力が気になる環境では既定の30秒のままをおすすめします。
        </div>
      </div>
      <div>
        <label className="block mb-2">
          <span className="font-bold">出撃記録の保存期間</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={0}
            aria-label="出撃記録の保存期間"
            value={logbookRetentionDays}
            onChange={async (e) => {
              const next = Math.max(0, Math.trunc(Number(e.target.value) || 0));
              await config.update({ logbookRetentionDays: next });
              setLogbookRetentionDays(next);
            }}
            className="border rounded p-2 w-24"
          />
          <span>日（0で無期限）</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          出撃記録ページに残す記録の日数です。この日数より古い記録は、次に出撃して母港に戻ったタイミングで削除されます。
        </div>
      </div>
    </FoldableSection>
  );
}
