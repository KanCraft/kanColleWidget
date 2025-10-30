import { useLoaderData } from "react-router-dom";
import { FrameSettingView } from "../components/options/FrameSettingView";
import { FileSaveSettingView } from "../components/options/FileSaveSettingView";
import { DashboardSettingView } from "../components/options/DashboardSettingView";
import { DamageSnapshotSettingView } from "../components/options/DamageSnapshotSettingView";

import { type Frame } from "../../models/Frame";
import { type FileSaveConfig } from "../../models/configs/FileSaveConfig";
import { type DashboardConfig } from "../../models/configs/DashboardConfig";
import { type DamageSnapshotConfig } from "../../models/configs/DamageSnapshotConfig";
import { DevelopmentInfoView, type ReleaseNoteObject } from "../components/options/DevelopmentInfoView";
import { VersionView } from "../components/options/VersionView";
import { type GameWindowConfig } from "../../models/configs/GameWindowConfig";

const KCWidgetChanURL = "https://cloud.githubusercontent.com/assets/931554/26664134/361ee756-46ca-11e7-98f5-d99e95dd90b8.png";

export function OptionsPage() {
  const {
    frames,
    game,
    releasenote,
    filesave,
    dashboard,
    damagesnapshot,
  } = useLoaderData() as {
    frames: Frame[];
    game: GameWindowConfig;
    releasenote: ReleaseNoteObject;
    filesave: FileSaveConfig;
    dashboard: DashboardConfig;
    damagesnapshot: DamageSnapshotConfig;
  };
  const manifest = chrome.runtime.getManifest();
  return (
    <div className="p-8">
      <Header releasenote={releasenote} manifest={manifest} />
      <VersionView manifest={manifest} />
      <Divider />
      <FrameSettingView frames={frames} config={game} />
      <Divider />
      <DashboardSettingView config={dashboard} />
      <Divider />
      <FileSaveSettingView config={filesave} />
      <Divider />
      <DamageSnapshotSettingView config={damagesnapshot} />
      <Divider />
      <DevelopmentInfoView releasenote={releasenote} />
    </div>
  );
}

function Header({ releasenote, manifest }: { releasenote: ReleaseNoteObject, manifest: chrome.runtime.Manifest }) {
  const announce = releasenote.releases[0].announce;
  const latestver = releasenote.releases[0].version;
  const contrib = releasenote.reference.repo.replace(/\/+$/, "") + "/graphs/contributors";
  return (
    <div>
      <h1 className="text-3xl font-bold">{manifest.name}の設定</h1>
      {announce ? <div className="mt-2 flex space-x-4 items-center">
        <div>
          <a href={contrib} target="_blank">
            <img src={KCWidgetChanURL} alt="艦これウィジェットちゃん" className="inline-block w-20" />
          </a>
        </div>
        <div className="">
          <div className="p-2 rounded bg-slate-100 text-orange-600">
            <div className="font-bold">[{latestver}]</div>
            <span>{announce.message}</span>
          </div>
        </div>
      </div> : null}
    </div>
  );
}

function Divider() {
  return <div className="border-t my-4" />;
}
