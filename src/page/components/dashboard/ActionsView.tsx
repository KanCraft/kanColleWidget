import { useMemo } from "react";
import { Launcher } from "../../../services/Launcher";
import { useRevalidator } from "react-router-dom";
import { ScreenshotService } from "../../../services/ScreenshotService";
import { CameraIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { Routes } from "../../../messages";
import type { Route } from "../../../messages";

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

function CaptureControlButton({ tab }: { tab?: chrome.tabs.Tab }) {
  if (!tab) return null;
  return (
    <div onClick={async () => {
      await ScreenshotService.take(tab.windowId);
    }} className="cursor-pointer text-slate-400 hover:text-slate-600" title="スクリーンショットを保存">
      <CameraIcon className="w-8 h-8" aria-hidden="true" />
    </div>
  )
}

function LaunchControlButton({ frameId }: { frameId: string }) {
  const onClick = async () => {
    try {
      await chrome.runtime.sendMessage<
        { __action__: Route<"FRAME_OPEN_OR_FOCUS">; frame_id?: string },
        { opened: boolean; frame_id: string | null }
      >(chrome.runtime.id, {
        __action__: Routes.FRAME_OPEN_OR_FOCUS,
        frame_id: frameId,
      });
    } catch (error) {
      console.error("/frame/open-or-focus の送信に失敗しました", error);
    }
  };
  return (
    <div onClick={onClick} className="cursor-pointer" title="抜錨！">
      <img src="/anchor.svg" alt="抜錨！" className="w-12 h-12" />
    </div>
  )
}

export function ActionsView({tab, frameId}: { tab?: chrome.tabs.Tab, frameId: string }) {
  const launcher = useMemo(() => new Launcher(), []);
  const revalidater = useRevalidator();
  const refresh = () => revalidater.revalidate();
  return (
    <div className="flex-1 flex items-center justify-end space-x-4">
      <LaunchControlButton frameId={frameId} />
      <CaptureControlButton tab={tab} />
      <MuteControlButton tab={tab} launcher={launcher} refresh={refresh} />
    </div>
  )
}
