import { useLoaderData } from "react-router-dom";
import { ServerPermissionView } from "./components/options/ServerPermissionView";
import { FrameSettingView } from "./components/options/FrameSettingView";

import { type ServerPermission } from "../services/PermissionsService";
import { type Frame } from "../models/Frame";
import { DevelopmentInfoView, type ReleaseNoteObject } from "./components/options/DevelopmentInfoView";

const KCWidgetChanURL = "https://cloud.githubusercontent.com/assets/931554/26664134/361ee756-46ca-11e7-98f5-d99e95dd90b8.png";

export function OptionsPage() {
  const {
    servers,
    frames,
    releasenote,
  } = useLoaderData() as {
    servers: ServerPermission[],
    frames: Frame[],
    releasenote: ReleaseNoteObject
  };
  return (
    <div className="p-8">
      <Header releasenote={releasenote} />
      <Divider />
      <FrameSettingView frames={frames} />
      <Divider />
      <ServerPermissionView servers={servers} />
      <Divider />
      <DevelopmentInfoView releasenote={releasenote} />
    </div>
  );
}

function Header({ releasenote }: { releasenote: ReleaseNoteObject }) {
  const announce = releasenote.releases[0].announce;
  const latestver = releasenote.releases[0].version;
  const contrib = releasenote.reference.repo.replace(/\/+$/, "") + "/graphs/contributors";
  return (
    <div>
      <h1 className="text-3xl font-bold">艦これウィジェットの設定</h1>
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
