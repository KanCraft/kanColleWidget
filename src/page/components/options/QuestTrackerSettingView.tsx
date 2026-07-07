import { useState } from "react";
import { NotificationConfig } from "../../../models/configs/NotificationConfig";
import { QuestTrackerConfig } from "../../../models/configs/QuestTrackerConfig";
import { FoldableSection } from "../FoldableSection";
import { NotificationConfigEditor } from "./NotificationSettingView";
import { useConfigField } from "./useConfigField";

export function QuestTrackerSettingView({
  notification,
  tracker,
}: {
  notification: NotificationConfig;
  tracker: QuestTrackerConfig;
}) {
  const [enabled, setEnabled] = useState<boolean>(notification.enabled);
  const [showOnDashboard, saveShowOnDashboard] = useConfigField(tracker, "showOnDashboard", tracker.showOnDashboard);

  return (
    <FoldableSection title="任務トラッカーの設定" id="quest-tracker">
      <div className="grid gap-4 md:grid-cols-2">
        <NotificationConfigEditor
          title="演習・出撃の任務未着手を通知する"
          config={notification}
          configId="quest-alert"
          enabled={enabled}
          onEnabledChange={(_id, next) => setEnabled(next)}
        />
      </div>
      <div className="text-sm text-gray-600 mt-1">
        演習画面・出撃準備画面を開いたとき、その日まだ着手していないデイリー任務があれば通知します。
      </div>

      <div className="mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOnDashboard}
            onChange={(e) => void saveShowOnDashboard(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-bold">ダッシュボードにも任務トラッカーを表示する</span>
        </label>
        <div className="text-sm text-gray-600 mt-1">
          任務トラッカーは既定では独立したタブで開きます。オンにするとダッシュボードにも同じ一覧を表示します。
        </div>
      </div>
    </FoldableSection>
  );
}
