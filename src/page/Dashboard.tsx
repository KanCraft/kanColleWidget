import { useLoaderData, useRevalidator } from "react-router-dom";
import { ActionsView } from "./components/dashboard/ActionsView";
import { ClockView } from "./components/dashboard/ClockView";
import { QueuesView } from "./components/dashboard/QueuesView";
import type Queue from "../models/Queue";
import { useEffect } from "react";

export function DashboardPage() {
  const { window, queues, time } = useLoaderData() as { window: chrome.windows.Window, queues: Queue[], time: Date };
  const revalidater = useRevalidator();
  useEffect(() => {
    const interval = setInterval(() => revalidater.revalidate(), 1000);
    return () => clearInterval(interval);
  }, [revalidater]);
  return (
    <div className="p-4">
      <div className="flex space-x-4">
        <ClockView time={time} />
        <ActionsView tab={window?.tabs?.[0]} />
      </div>
      <QueuesView queues={queues} />
    </div>
  )
}