import type { ResultSet } from "../../fleet-capture/types";

interface ResultGridProps {
  composition: string[][];
  results: ResultSet;
  // 空セルのプレースホルダに使うアスペクト比（CSS aspect-ratio 値）
  cellAspectRatio: string;
  onRequestCapture: (rowIndex: number, colIndex: number) => void;
}

export function ResultGrid({ composition, results, cellAspectRatio, onRequestCapture }: ResultGridProps) {
  return (
    <table className="table-auto border-collapse border">
      <tbody>
        {composition.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((label, colIndex) => {
              const src = results[rowIndex]?.[colIndex];
              return (
                <td key={`${rowIndex}-${colIndex}`} className="border">
                  {src ? (
                    <button
                      type="button"
                      className="block cursor-pointer"
                      title="クリックで撮り直し"
                      onClick={() => onRequestCapture(rowIndex, colIndex)}
                    >
                      <img src={src} alt={`${label}のキャプチャ`} className="block w-48" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-48 bg-gray-200 flex items-center justify-center cursor-pointer text-gray-600"
                      style={{ aspectRatio: cellAspectRatio }}
                      onClick={() => onRequestCapture(rowIndex, colIndex)}
                    >
                      {label}
                    </button>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
