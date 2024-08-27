import { useLoaderData } from "react-router-dom";
import {  ServerPermission } from "../services/PermissionsService";
import { ServerPermissionView } from "./components/options/ServerPermissionView";

export function OptionsPage() {
  const { servers } = useLoaderData() as { servers: ServerPermission[] }
  return (
    <div className="p-8">
      <ServerPermissionView servers={servers} />
      <hr />
    </div>
  );
}