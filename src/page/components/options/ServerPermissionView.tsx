import { useRevalidator } from "react-router-dom";
import { PermissionsService, ServerPermission } from "../../../services/PermissionsService";
import { FoldableSection } from "../FoldableSection";


export function ServerPermissionView({ servers }: { servers: ServerPermission[] }) {
  const perms = new PermissionsService();
  const revalidator = useRevalidator();
  return (
    <FoldableSection title="所属サーバ選択" id="server-perms">
      <div className="mb-4">
        <p>艦これウィジェットv4では、Chrome拡張のセキュリティ強化ガイドラインに則り、限られたサーバに対してのみ機能を有効化できるようにしたんですが、修復のタイマーなどで自動でプレー画面のスクショを撮ってOCRなどするときに「すべてのウェブサイト」の許可が必要になるので、ここでサーバを選択しても全部許可されます. 必要なので仕方ない.</p>
        <p>この操作は、いつでも変更できます.</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {servers.map((server) => {
          const c = server.granted ? "border-teal-300 bg-teal-200" : "border-slate-200 bg-slate-100";
          return <div className={"border rounded p-2 cursor-pointer " + c} onClick={async () => {
            if (server.granted) await perms.servers.revoke([server.ip_address]);
            else await perms.servers.request([server.ip_address]);
            perms.request({ origins: [`<all_urls>`], permissions: ["activeTab"] });
            revalidator.revalidate();
          }}>
            <h3 className="text-lg font-bold">{server.name}</h3>
            <code>{server.ip_address}</code>
            {server.granted ? <p className="text-slate-400">Granted</p> : <p className="text-red-200">Not granted</p>}
          </div>;
        })}
      </div>
      <div>
        {servers.every(s => s.granted) ?
          <div className="border rounded cursor-pointer text-lg p-4 text-center bg-red-200" onClick={async () => {
            await perms.servers.revoke(servers.map((s) => s.ip_address));
            await perms.revoke({ origins: [`<all_urls>`] });
            revalidator.revalidate();
          }}>すべてのサーバについて許可を取り消す</div>
          :
          <div className="border rounded cursor-pointer text-lg p-4 text-center" onClick={async () => {
            await perms.servers.request(servers.map((s) => s.ip_address));
            await perms.request({ origins: [`<all_urls>`], permissions: ["activeTab"] });
            revalidator.revalidate();
          }}>すべてのサーバについて許可する</div>
        }
      </div>
    </FoldableSection>
  )
}