import { TriggerType } from ".";

// 通知ID /{type}/{trigger}/{target} と設定レコードキー /{type}/{trigger} のコーデック。
// CLAUDE.md 通知ID規約の単一実装。
// type は "default"（EntryType.TEST_DEFAULT）や "quest-alert"（EntryType 外の単発通知）も
// 通すため string で受ける。

export interface ParsedNotificationId {
  type: string;
  trigger: string;
  target?: string;
}

// 通知ID /{type}/{trigger}/{target} を組み立てる。
function build(type: string, trigger: TriggerType, target: number | string): string {
  return `/${type}/${trigger}/${target}`;
}

// 設定レコードキー /{type}/{trigger} を組み立てる。
function configKey(type: string, trigger: TriggerType): string {
  return `/${type}/${trigger}`;
}

// 通知ID・設定キーを type/trigger/target に分解する。
// /{type}/{trigger} 未満の形式（先頭が / で始まらない、type または trigger が空）は null を返す。
// フォールバック判断は呼び出し側の責務とし、ここでは分解できたものを正直に返す。
function parse(id: string): ParsedNotificationId | null {
  const [head, type, trigger, target] = id.split("/");
  if (head !== "" || !type || !trigger) return null;
  return target === undefined ? { type, trigger } : { type, trigger, target };
}

// parse 結果に対し、与えた条件（type/trigger/target）だけをセグメント単位で完全一致比較する。
// 条件に無いセグメントは不問。target を見る/見ないの差はこの optional 条件で表現する。
function matches(id: string, cond: { type?: string; trigger?: string; target?: string }): boolean {
  const parsed = parse(id);
  if (!parsed) return false;
  if (cond.type !== undefined && parsed.type !== cond.type) return false;
  if (cond.trigger !== undefined && parsed.trigger !== cond.trigger) return false;
  if (cond.target !== undefined && parsed.target !== cond.target) return false;
  return true;
}

export const NotificationId = { build, configKey, parse, matches };
