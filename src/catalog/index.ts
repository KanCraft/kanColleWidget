
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

// 任務カタログ（デイリー任務のうち、前提任務の連鎖を把握したいもののみ収録）
import questdata from "./quests.json";
export type QuestCategory =
    | "sortie" // 出撃
    | "supply" // 補給（該当任務なし、将来のため予約）
    | "mission" // 遠征
    | "recovery" // 入渠
    | "shipbuilding" // 建造
    | "createitem" // 開発
    | "remodel" // 改修工廠
    | "destroyship" // 解体
    | "destroyitem" // 廃棄
    | "practice"; // 演習
export type QuestCondition =
    | "date037" // 日付の下1桁が0/3/7の日のみ
    | "date28"; // 日付の下1桁が2/8の日のみ
export interface QuestSpec {
    title: string;
    category: QuestCategory;
    requires: number[]; // 前提任務ID。空なら着手可能な状態から始まる
    condition?: QuestCondition;
}
export interface QuestCatalog {
    [id: string]: QuestSpec;
}
export const quests = questdata as unknown as QuestCatalog;
