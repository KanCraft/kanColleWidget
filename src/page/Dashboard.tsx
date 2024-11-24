import { useLoaderData } from "react-router-dom";
import { ActionsView } from "./components/dashboard/ActionsView";
import { ClockView } from "./components/dashboard/ClockView";
import { QueuesView } from "./components/dashboard/QueuesView";

export function DashboardPage() {
  const { window } = useLoaderData() as { window: chrome.windows.Window };
  return (
    <div className="p-4">
      <div className="flex space-x-4">
        <ClockView />
        <ActionsView tab={window?.tabs?.[0]} />
      </div>
      <QueuesView />
    </div>
  )
}