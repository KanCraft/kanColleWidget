import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Launcher } from "../../../services/Launcher";
import { useRevalidator } from "react-router-dom";
import { DownloadService } from "../../../services/DownloadService";

function MuteControlButton({ tab, launcher, refresh }: { tab?: chrome.tabs.Tab, launcher: Launcher, refresh: () => void }) {
  if (!tab) return null;
  const onClick = async () => { await launcher.mute(tab.id!, !tab.mutedInfo?.muted); refresh(); };
  const icon = tab.mutedInfo?.muted ? "volume-mute" : "volume-high";
  return (
    <div onClick={onClick} className="cursor-pointer text-slate-400 hover:text-slate-600">
      <FontAwesomeIcon icon={icon} className="w-8 h-8" />
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
      const dir = "艦これ";
      /* const downloadId = */ await s.download(uri, DownloadService.filename.screenshot({ dir, format }));
      // await s.show(downloadId);
    }} className="cursor-pointer text-slate-400 hover:text-slate-600">
      <FontAwesomeIcon icon="camera" className="w-8 h-8"/>
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