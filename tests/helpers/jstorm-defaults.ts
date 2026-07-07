import { beforeEach } from "vitest";

// static default を持つ jstorm Model クラスの静的側
interface ModelClassWithDefault {
  default: Record<string, unknown>;
}

// jstorm はストレージが空の間 static default オブジェクトをそのまま返し、save()/update() は
// そのオブジェクトへ直接書き込む。同一ファイル内のテスト間で default の汚染が波及しないよう、
// 呼び出し時点（モジュール読み込み時）のスナップショットを各テスト前に復元する。
// 注意: tests/setup.ts へは移さないこと。NotificationConfig など default 初期化子で
// chrome.runtime.getURL を呼ぶモデルがあり、setup.ts は各 spec の chrome スタブ
// （vi.hoisted）より前に実行されるため、モデルの import 自体が失敗する。
export function restoreDefaultsBeforeEach(...models: ModelClassWithDefault[]): void {
  const snapshots = models.map((model) => structuredClone(model.default));
  beforeEach(() => {
    models.forEach((model, i) => {
      model.default = structuredClone(snapshots[i]);
    });
  });
}
