interface PresetActionButtonsProps {
  canUpdate: boolean;
  canDelete: boolean;
  onUpdate: () => void;
  onSaveAsNew: () => void;
  onDelete: () => void;
}

export function PresetActionButtons({
  canUpdate,
  canDelete,
  onUpdate,
  onSaveAsNew,
  onDelete,
}: PresetActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <ActionButton disabled={!canUpdate} onClick={onUpdate}>
        プリセットを更新
      </ActionButton>
      <ActionButton disabled={false} onClick={onSaveAsNew}>
        名前を付けて保存
      </ActionButton>
      <ActionButton disabled={!canDelete} onClick={onDelete}>
        プリセットを削除
      </ActionButton>
    </div>
  );
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
      className={`border rounded p-2 border-slate-200 bg-slate-100 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
