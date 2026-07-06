import { useEffect, useRef, useState } from "react";
import { QuestCategory } from "../../../catalog";
import { QuestProgress, QuestStatus, VisibleQuest } from "../../../models/QuestProgress";

const STATUS_LABELS: Record<QuestStatus, string> = {
  [QuestStatus.OPEN]: "未着手",
  [QuestStatus.ONGOING]: "遂行中",
  [QuestStatus.COMPLETED]: "達成",
  [QuestStatus.LOCKED]: "未解放",
};

const STATUS_COLORS: Record<QuestStatus, string> = {
  [QuestStatus.OPEN]: "bg-slate-100 text-slate-600",
  [QuestStatus.ONGOING]: "bg-amber-100 text-amber-700",
  [QuestStatus.COMPLETED]: "bg-emerald-100 text-emerald-700",
  [QuestStatus.LOCKED]: "bg-slate-100 text-slate-400",
};

const CATEGORY_LABELS: Record<QuestCategory, string> = {
  sortie: "出撃",
  supply: "補給",
  mission: "遠征",
  recovery: "入渠",
  shipbuilding: "建造",
  createitem: "開発",
  remodel: "改修",
  destroyship: "解体",
  destroyitem: "廃棄",
  practice: "演習",
};

// ゲーム内の任務カテゴリ配色に合わせた色（v3 dashboard.scss 準拠。未定義カテゴリはv3でも無地だった）
const CATEGORY_COLORS: Record<QuestCategory, string> = {
  sortie: "bg-[#e85600]",
  practice: "bg-[#32b643]",
  mission: "bg-[#5755d9]",
  recovery: "bg-[#56c2c1]",
  shipbuilding: "bg-[#fa9836]",
  createitem: "bg-[#fa9836]",
  remodel: "bg-slate-400",
  destroyship: "bg-slate-400",
  destroyitem: "bg-slate-400",
  supply: "bg-slate-400",
};

// 任務の状態を手動で上書きする（API傍受の取りこぼしや他端末での進行とのズレを補正するため）
function StatusEditModal({
  quest, onSelect, onClose,
}: {
  quest: VisibleQuest;
  onSelect: (status: QuestStatus) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-lg">
      <div className="bg-white p-4 flex flex-col space-y-4 rounded-md max-w-sm">
        <div className="font-bold">{quest.title}</div>
        <div className="flex space-x-2 justify-end">
          {([QuestStatus.OPEN, QuestStatus.ONGOING, QuestStatus.COMPLETED] as const).map((status) => (
            <button
              key={status}
              className={`px-3 py-1 rounded text-sm ${STATUS_COLORS[status]}`}
              onClick={() => onSelect(status)}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
          <button className="px-3 py-1 rounded text-sm bg-slate-50" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}

export function QuestTrackerList({
  progress, onChanged, compact = false,
}: {
  progress: QuestProgress;
  onChanged: () => void;
  // ダッシュボードの小窓に埋め込むとき用に、他ウィジェット（FatigueQueueViewなど）と
  // 同じtext-xs基調の詰まった表示にする。独立タブでは既定のtext-smのまま
  compact?: boolean;
}) {
  const [editing, setEditing] = useState<VisibleQuest | null>(null);

  // onChanged は呼び出し側で毎レンダー新しいクロージャになりうる（ダッシュボードは1秒毎に再レンダー）
  // ため、ref経由で参照して購読の貼り直しを避ける。
  const onChangedRef = useRef(onChanged);
  useEffect(() => {
    onChangedRef.current = onChanged;
  }, [onChanged]);

  // 他タブ・ダッシュボード・バックグラウンド側での着手/達成をポーリングなしで反映する。
  // 更新頻度は低いので、更新ボタンやインターバルではなくストレージ変更イベントに任せる。
  useEffect(() => {
    const listener = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
      if (areaName !== "local" || !("QuestProgress" in changes)) return;
      onChangedRef.current();
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const applyStatus = async (id: number, status: QuestStatus) => {
    if (status === QuestStatus.OPEN) await progress.stop(id);
    else if (status === QuestStatus.ONGOING) await progress.start(id);
    else if (status === QuestStatus.COMPLETED) await progress.complete(id);
    setEditing(null);
    onChanged();
  };

  const visible = progress.visibleQuests();

  if (visible.length === 0) {
    return <div className="text-center py-4 text-slate-400 text-sm">今日の任務はありません</div>;
  }

  return (
    <div>
      {visible.map((quest) => (
        <div
          key={quest.id}
          className={`flex items-center space-x-2 px-1 odd:bg-slate-100 ${compact ? "text-xs py-0.5" : "text-sm py-1"}`}
        >
          <span
            className={`text-white text-center shrink-0 rounded ${CATEGORY_COLORS[quest.category]} ${compact ? "text-[10px] px-1 w-10" : "text-xs px-1.5 py-0.5 w-12"}`}
          >
            {CATEGORY_LABELS[quest.category]}
          </span>
          <span className="flex-1">{quest.title}</span>
          <button
            className={`rounded ${STATUS_COLORS[quest.status]} ${compact ? "text-[10px] px-1.5" : "px-2 py-0.5"}`}
            onClick={() => setEditing(quest)}
          >
            {STATUS_LABELS[quest.status]}
          </button>
        </div>
      ))}
      {editing ? (
        <StatusEditModal
          quest={editing}
          onSelect={(status) => applyStatus(editing.id, status)}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}
