import { expect, describe, it, vi } from "vitest";

// chromite（logger 経由で import される）はモジュール読み込み時に chrome.runtime を参照するため、
// import より前にスタブする。本テストは純粋関数のみ検証するので最小構成で良い。
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { id: "test", onMessage: { addListener: () => {} } } };
});

import { maskFormData, buildRecord, MASK_VALUE } from "../src/services/RequestRecorder";

describe("maskFormData", () => {
  it("機密フィールドをマスクし、他は保持する", () => {
    const input = {
      api_deck_id: ["1"],
      api_maparea_id: ["1"],
      api_token: ["secret-token"],
      api_serial_cid: ["cid"],
      api_verno: ["3"],
    };
    const masked = maskFormData(input);
    expect(masked.api_token).toBe(MASK_VALUE);
    expect(masked.api_serial_cid).toBe(MASK_VALUE);
    expect(masked.api_verno).toBe(MASK_VALUE);
    expect(masked.api_deck_id).toEqual(["1"]);
    expect(masked.api_maparea_id).toEqual(["1"]);
  });

  it("マスクしてもキー自体は残す（伏せたことが分かる）", () => {
    const masked = maskFormData({ api_token: ["x"] });
    expect(Object.keys(masked)).toContain("api_token");
  });

  it("元オブジェクトを破壊しない", () => {
    const input = { api_token: ["x"] };
    maskFormData(input);
    expect(input.api_token).toEqual(["x"]);
  });

  it("undefined / null は空オブジェクトを返す", () => {
    expect(maskFormData(undefined)).toEqual({});
    expect(maskFormData(null)).toEqual({});
  });
});

describe("buildRecord", () => {
  const details = {
    url: "https://w14j.kancolle-server.com/kcsapi/api_req_map/start",
    method: "POST",
    tabId: 5,
    frameId: 0,
    requestBody: { formData: { api_token: ["t"], api_maparea_id: ["1"] } },
  } as unknown as chrome.webRequest.OnBeforeRequestDetails;

  it("path / method / tabId / frameId / timestamp / マスク済み formData を含む", () => {
    const record = buildRecord(details, 1717718400000);
    expect(record).toEqual({
      timestamp: 1717718400000,
      path: "/kcsapi/api_req_map/start",
      method: "POST",
      tabId: 5,
      frameId: 0,
      formData: { api_token: MASK_VALUE, api_maparea_id: ["1"] },
    });
  });

  it("formData が無いリクエストでも空 formData で記録できる", () => {
    const noBody = {
      url: "https://w14j.kancolle-server.com/kcsapi/api_port/port",
      method: "POST",
      tabId: 1,
      frameId: 0,
    } as unknown as chrome.webRequest.OnBeforeRequestDetails;
    const record = buildRecord(noBody, 1);
    expect(record.path).toBe("/kcsapi/api_port/port");
    expect(record.formData).toEqual({});
  });
});
