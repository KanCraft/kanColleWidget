import { useLoaderData } from "react-router-dom";
import { ServerPermissionView } from "./components/options/ServerPermissionView";
import { FrameSettingView } from "./components/options/FrameSettingView";

import { type ServerPermission } from "../services/PermissionsService";
import { type Frame } from "../models/Frame";

export function OptionsPage() {
  const {
    servers,
    frames,
  } = useLoaderData() as { servers: ServerPermission[], frames: Frame[] };
  return (
    <div className="p-8">
      <Header />
      <Divider />
      <FrameSettingView frames={frames} />
      <Divider />
      <ServerPermissionView servers={servers} />
      <Divider />
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold">艦これウィジェットの設定</h1>
      <p className="text-gray-500">Configure your settings</p>
    </div>
  );
}

function Divider() {
  return <div className="border-t my-4" />;
}
