interface ExportButtonProps {
  disabled: boolean;
  onExport: () => void;
}

export function ExportButton({ disabled, onExport }: ExportButtonProps) {
  return (
    <button
      type="button"
      className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
      onClick={onExport}
    >
      上記を1枚の画像にしてエクスポート
    </button>
  );
}
