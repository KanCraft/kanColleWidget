import { useLoaderData, useRevalidator } from "react-router-dom";
import { ArrowPathIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { QuestProgress } from "../../models/QuestProgress";
import { QuestTrackerList } from "../components/quest-tracker/QuestTrackerList";

export function QuestTrackerPage() {
  const { progress } = useLoaderData() as { progress: QuestProgress };
  const revalidator = useRevalidator();

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-2">
        <ClipboardDocumentCheckIcon className="w-6 h-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-800">任務トラッカー</h1>
        <button
          onClick={() => revalidator.revalidate()}
          className="ml-4 flex items-center space-x-1 border rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>更新</span>
        </button>
      </div>

      <QuestTrackerList progress={progress} onChanged={() => revalidator.revalidate()} />
    </div>
  );
}
