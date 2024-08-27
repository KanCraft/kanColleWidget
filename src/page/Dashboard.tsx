import { ClockView } from "./components/dashboard/ClockView";
import { QueuesView } from "./components/dashboard/QueuesView";

export function DashboardPage() {
  return (
    <div className="p-4">
      <ClockView />
      <QueuesView />
    </div>
  )
}