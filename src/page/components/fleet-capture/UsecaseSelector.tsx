import type { Usecase } from "../../fleet-capture/types";

interface UsecaseSelectorProps {
  usecases: Usecase[];
  selectedId: string;
  onSelect: (usecaseId: string) => void;
}

export function UsecaseSelector({ usecases, selectedId, onSelect }: UsecaseSelectorProps) {
  return (
    <select
      value={selectedId}
      onChange={(event) => onSelect(event.target.value)}
      className="border p-2 rounded"
    >
      {usecases.map((usecase) => (
        <option key={usecase.id} value={usecase.id}>
          {usecase.title}
        </option>
      ))}
    </select>
  );
}
