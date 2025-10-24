import { useMemo } from "react";
import { Launcher } from "../../../services/Launcher";
import { useRevalidator } from "react-router-dom";
import { DownloadService } from "../../../services/DownloadService";
import { CameraIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

function MuteControlButton({ tab, launcher, refresh }: { tab?: chrome.tabs.Tab, launcher: Launcher, refresh: () => void }) {
  if (!tab) return null;
  const onClick = async () => { await launcher.mute(tab.id!, !tab.mutedInfo?.muted); refresh(); };
  const Icon = tab.mutedInfo?.muted ? SpeakerXMarkIcon : SpeakerWaveIcon;
  return (
    <div onClick={onClick} className="cursor-pointer text-slate-400 hover:text-slate-600" title="ミュート切り替え">
      <Icon className="w-8 h-8" aria-hidden="true" />
    </div>
  )
}

function CaptureControlButton({ tab, launcher }: { tab?: chrome.tabs.Tab, launcher: Launcher }) {
  if (!tab) return null;
  return (
    <div onClick={async () => {
      const s = new DownloadService();
      const format = "png";
      const uri = await launcher.capture(tab.windowId, { format });
      const filename = DownloadService.filename.screenshot({ dir: "艦これ", format });
      /* const downloadId = */ await s.download(uri, filename);
      // await s.show(downloadId);
    }} className="cursor-pointer text-slate-400 hover:text-slate-600" title="スクリーンショットを保存">
      <CameraIcon className="w-8 h-8" aria-hidden="true" />
    </div>
  )
}

function LaunchControlButton() {
  return (
    <div>
      <img src="/anchor.svg" alt="anchor" className="w-12 h-12" />
    </div>
  )
}

export function ActionsView({tab}: { tab?: chrome.tabs.Tab }) {
  const launcher = useMemo(() => new Launcher(), []);
  const revalidater = useRevalidator();
  const refresh = () => revalidater.revalidate();
  return (
    <div className="flex-1 flex items-center justify-end space-x-4">
      <LaunchControlButton />
      <CaptureControlButton tab={tab} launcher={launcher} />
      <MuteControlButton tab={tab} launcher={launcher} refresh={refresh} />
    </div>
  )
}
