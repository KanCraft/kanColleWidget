import { useLoaderData, useNavigate } from "react-router-dom";
import { PermissionsService, ServerPermission } from "../services/PermissionsService";

// これ別にあとあとオプションページに持っていけばいいと思う
export function ServerPermissonPage() {
    const { servers } = useLoaderData() as { servers: ServerPermission[] }
    const navigate = useNavigate();
    const perms = new PermissionsService();
    return (
        <div className="p-8">
            <div className="mb-4">
                <h1 className="text-xl font-bold">所属サーバ選択</h1>
                <p>艦これウィジェットv4では、Chrome拡張のセキュリティ強化ガイドラインに則り、限られたサーバに対してのみ機能を有効化できるようにしています.</p>
                <p>ここで許可されたサーバで艦これをプレーする時に限り、遠征タイマーなどが自動でセットされます.</p>
                <p>この操作は、いつでも変更できます.</p>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
                {servers.map((server) => {
                    const c = server.granted ? "border-teal-300 bg-teal-200" : "border-slate-200 bg-slate-100";
                    return <div className={"border rounded p-2 cursor-pointer " + c} onClick={async () => {
                        if (server.granted) await perms.servers.revoke([server.ip_address]);
                        else await perms.servers.request([server.ip_address]);
                        navigate(0);
                    }}>
                        <h3 className="text-lg font-bold">{server.name}</h3>
                        <code>{server.ip_address}</code>
                        {server.granted ? <p className="text-slate-400">Granted</p> : <p className="text-red-200">Not granted</p>}
                    </div>;
                })}
            </div>
            <div>
                <div className="border rounded cursor-pointer text-lg p-4 text-center" onClick={async () => {
                    await perms.servers.request(servers.map((s) => s.ip_address));
                    navigate(0);
                }}>すべてのサーバについて許可する</div>
            </div>
        </div>
    );
}