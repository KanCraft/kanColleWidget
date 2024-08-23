import type { ServerCatalog, ServerEntry } from "../catalog";

export type ServerPermission = {
    granted: boolean;
} & ServerEntry;

export class PermissionsService {
    constructor(
        private readonly mod: typeof chrome.permissions = chrome.permissions,
    ) { }

    // 艦これサーバのモジュール
    public servers = {
        request: async (addresses: string[]) => {
            const origins = addresses.map((address) => `http://${address}/*`);
            return await this.mod.request({ origins });
        },
        contains: async (address: string) => {
            return await this.mod.contains({ origins: [`http://${address}/*`] });
        },
        granted: async (servers: ServerCatalog) => {
            const entries: ServerPermission[] = [];
            for (let i = 0; i < servers.length; i++) {
                const granted = await this.servers.contains(servers[i].ip_address);
                entries.push({ ...servers[i], granted });
            }
            return entries;
        },
    }
}