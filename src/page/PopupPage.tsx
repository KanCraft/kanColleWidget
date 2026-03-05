import { useLoaderData } from "react-router-dom"
import { Launcher } from "../services/Launcher"
import { type Frame } from "../models/Frame"

import { useState, type ReactNode } from "react";
import { ClockIcon, SquaresPlusIcon, Cog6ToothIcon, BookOpenIcon } from "@heroicons/react/24/outline";

function ShortCutIcon({icon, title, action}: {
  icon: ReactNode;
  title: string;
  action: () => void;
}) {
  return (
    <div className="py-2 px-4 cursor-pointer text-slate-400 hover:text-slate-600 transition hover:bg-teal-50"
      title={title} onClick={action}
    >{icon}</div>
  )
}

export function PopupPage() {
  const { frames } = useLoaderData() as { frames: Frame[] }
  const [selectedId, selectId] = useState<string>("__memory__");

  const openFrame = async (frameId?: string) => {
    if (typeof chrome === "undefined" || !chrome.runtime?.id) return;
    try {
      await chrome.runtime.sendMessage<
        { action: string; frame_id?: string },
        { opened: boolean; frame_id: string | null }
      >(chrome.runtime.id, {
        action: "/frame/open-or-focus",
        frame_id: frameId,
      });
    } catch (error) {
      console.error("/frame/open-or-focus の送信に失敗しました", error);
    }
  };

  return (
    <div className="lg:container p-2">
      <div className="flex divide-x rounded-lg border border-slate-200 overflow-hidden w-60 mb-2">
        <div className="grow">
          <select className="h-full w-full text-lg px-4 cursor-pointer hover:bg-indigo-50 transition-all appearance-none"
            defaultValue={selectedId} onChange={(e) => {
              const frameId = e.target.value;
              selectId(frameId);
              void openFrame(frameId);
            }}
          >{frames.map((frame) => <option value={frame._id!} key={frame._id}>{frame.name}</option>)}</select>
        </div>
        <div className="py-2 pr-2 pl-1.5 w-10 cursor-pointer hover:bg-indigo-50 transition-all"
          onClick={() => {
            void openFrame(selectedId);
          }}
        ><img src="/anchor.svg" alt="抜錨！" title="抜錨！" />
        </div>
      </div>
      <div className="flex divide-x rounded-lg border border-slate-200 overflow-hidden w-min">
        <ShortCutIcon icon={<ClockIcon className="w-5 h-5" aria-hidden="true" />} title="ダッシュボードを開く" action={() => Launcher.dashboard()} />
        <ShortCutIcon icon={<SquaresPlusIcon className="w-5 h-5" aria-hidden="true" />} title="編成キャプチャを開く" action={() => Launcher.fleetcapture()} />
        <ShortCutIcon icon={<BookOpenIcon className="w-5 h-5" aria-hidden="true" />} title="出撃記録を開く" action={() => Launcher.logbook()} />
        <ShortCutIcon icon={<Cog6ToothIcon className="w-5 h-5" aria-hidden="true" />} title="設定を開く" action={() => Launcher.options()} />
      </div>
    </div>
  )
}
