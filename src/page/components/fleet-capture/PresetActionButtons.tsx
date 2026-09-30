interface PresetActionButtonsProps {
  // 編集中の値がプリセットの保存値と異なるか
  modified: boolean;
  // 選択中が組み込みプリセット（上書きできない）か
  builtin: boolean;
  // 保存の完了を知らせる一時的な表示
  notice: string | null;
  onUpdate: () => void;
  onSaveAsNew: () => void;
}

/**
 * 編集中の内容をプリセットへ保存する導線
 */
export function PresetActionButtons({
  modified,
  builtin,
  notice,
  onUpdate,
  onSaveAsNew,
}: PresetActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <ActionButton disabled={false} onClick={onSaveAsNew}>
        名前を付けて保存
      </ActionButton>
      <ActionButton disabled={builtin || !modified} onClick={onUpdate}>
        プリセットを更新
      </ActionButton>
      <span className="text-sm text-gray-600">{notice ?? statusText(builtin, modified)}</span>
    </div>
  );
}

function statusText(builtin: boolean, modified: boolean): string {
  if (builtin) return "組み込みプリセットは上書きできません";
  if (modified) return "変更あり";
  return "";
}

function ActionButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      className={`border rounded p-2 ${
        disabled
          ? "border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed"
          : "border-blue-400 bg-white text-blue-600 cursor-pointer"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
