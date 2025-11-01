
// 遠征カタログ
import missiondata from "./missions.json";
export type MissionCategory = "monthly" | "weekly" | "daily" | "others" | "test"; // わらかんけどいったんおいておく
export interface MissionSpec {
    title: string;
    category: MissionCategory;
    time: number; // かかる時間;ミリ秒
}
export interface MissionCatalog {
    [id: string]: MissionSpec;
}
export const missions = missiondata as unknown as MissionCatalog;

// サーバカタログ
export interface ServerEntry {
    name: string;
    ip_address: string;
}
export type ServerCatalog = ServerEntry[];
