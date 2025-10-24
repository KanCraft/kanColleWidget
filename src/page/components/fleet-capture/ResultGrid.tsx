import type { ResultSet, Usecase } from "../../fleet-capture/types";

interface ResultGridProps {
  usecase: Usecase;
  results: ResultSet;
  onRequestCapture: (rowIndex: number, colIndex: number) => void;
}

export function ResultGrid({ usecase, results, onRequestCapture }: ResultGridProps) {
  return (
    <table className="table-auto border-collapse border w-1/3">
      <tbody>
        {usecase.composition.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((label, colIndex) => {
              const src = results[rowIndex]?.[colIndex];
              return (
                <td key={`${rowIndex}-${colIndex}`} className="border">
                  {src ? (
                    <img src={src} alt={`${label}のキャプチャ`} />
                  ) : (
                    <button
                      type="button"
                      className="w-32 h-24 bg-gray-200 flex items-center justify-center cursor-pointer text-gray-600"
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
