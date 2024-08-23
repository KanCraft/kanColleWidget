
// 遠征カタログ
import missiondata from "./missions.json";
export type MissionCategory = "monthly" | "weekly" | "daily"; // わらかんけどいったんおいておく
export interface MissionCatalog {
    [id: string]: {
        title: string;
        category: MissionCategory;
        time: number; // かかる時間;ミリ秒
    }
}
export const missions = missiondata as unknown as MissionCatalog;

// サーバカタログ
import serverdata from "./servers.json";
export interface ServerEntry {
    name: string;
    ip_address: string;
}
export type ServerCatalog = ServerEntry[];
export const servers = serverdata as unknown as ServerCatalog;
