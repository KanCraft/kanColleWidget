import type { Purpose } from "../../services/CropService";

export interface Usecase {
  id: string;
  title: string;
  description: string;
  crop: Purpose;
  page: number;
  count: number;
  composition: string[][];
}

export type ResultSet = (string | null)[][];

export interface FleetCaptureController {
  availableUsecases: Usecase[];
  activeUsecase: Usecase;
  results: ResultSet;
  selectUsecase: (usecaseId: string) => void;
  captureCell: (rowIndex: number, colIndex: number) => Promise<void>;
  exportResults: () => Promise<void>;
  isExportDisabled: boolean;
}

export function createEmptyResultSet(composition: string[][]): ResultSet {
  return composition.map((row) => row.map(() => null));
}
