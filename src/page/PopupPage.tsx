import { useLoaderData } from "react-router-dom"
import { Launcher } from "../services/Launcher"
import { Frame } from "../models/Frame"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function PopupPage() {
  const { frames } = useLoaderData() as { frames: Frame[] }
  const defaultId = "__memory__";
  return (
    <div className="lg:container p-2">
      <div className="flex divide-x rounded-lg border border-slate-200 overflow-hidden w-60 mb-2">
        <div className="grow">
          <select className="h-full w-full text-lg px-4 cursor-pointer hover:bg-indigo-50 transition-all appearance-none"
            defaultValue={defaultId} onChange={(e) => {
              const frame = frames.find((frame) => frame._id === e.target.value);
              if (frame) Launcher.launch(frame);
            }}
          >{frames.map((frame) => <option value={frame._id!}>{frame.name}</option>)}</select>
        </div>
        <div className="py-2 pr-2 pl-1.5 w-10 cursor-pointer hover:bg-indigo-50 transition-all"
          onClick={() => {
            const frame = frames.find((frame) => frame._id === defaultId);
            if (frame) Launcher.launch(frame);
          }}
        ><img src="/anchor.svg" alt="抜錨！" title="抜錨！" />
        </div>
      </div>
      <div className="flex divide-x rounded-lg border border-slate-200 overflow-hidden w-min">
        <div className="py-2 px-4 cursor-pointer text-slate-400 hover:text-slate-600 transition hover:bg-teal-50"
          title="ダッシュボードを開く"
          onClick={() => Launcher.dashboard()}
        ><FontAwesomeIcon icon="clock" className="" /></div>
      </div>
    </div>
  )
}