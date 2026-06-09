
// 海域名カタログ（番号 "area-info" → 日本語海域名。通常海域のみ収録。best-effort で、
// 未収録の海域は呼び出し側で番号表示にフォールバックする。 @see #1764）
import areadata from "./areas.json";
export interface AreaCatalog {
    [areaNumber: string]: string;
}
export const areas = areadata as AreaCatalog;

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
