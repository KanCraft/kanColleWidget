import { useLoaderData, useRevalidator } from "react-router-dom";
import { ActionsView } from "./components/dashboard/ActionsView";
import { ClockView } from "./components/dashboard/ClockView";
import { QueuesView } from "./components/dashboard/QueuesView";
import type Queue from "../models/Queue";
import { useEffect } from "react";

export function DashboardPage() {
  const { window, queues, time } = useLoaderData() as { window: chrome.windows.Window, queues: Queue[], time: Date };
  const revalidater = useRevalidator();

  // 1秒ごとにデータを再検証
  useEffect(() => {
    const interval = setInterval(() => revalidater.revalidate(), 1000);
    return () => clearInterval(interval);
  }, [revalidater]);

  // 60秒ごとにウィンドウの位置とサイズを保存
  useEffect(() => {
    const trackWindowState = async () => {
      try {
        const currentWindow = await chrome.windows.getCurrent();
        if (!currentWindow.left || !currentWindow.top || !currentWindow.width || !currentWindow.height) return;

        await chrome.runtime.sendMessage({
          __action__: "/dashboard:track",
          left: currentWindow.left,
          top: currentWindow.top,
          width: currentWindow.width,
          height: currentWindow.height,
        });
      } catch (error) {
        console.error("Failed to track dashboard window state:", error);
      }
    };

    // 初回実行
    trackWindowState();

    // 60秒ごとに実行
    const interval = setInterval(trackWindowState, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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