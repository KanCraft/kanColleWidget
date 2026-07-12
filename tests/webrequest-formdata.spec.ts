import { expect, describe, it, vi } from "vitest";

// formdata.ts の import 連鎖(chromite)が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
  };
});

import { formData } from "../src/controllers/WebRequest/formdata";

interface SampleFormData {
  api_id: string[];
}

// webRequest details から formData<T>() が型付きで取り出せるか、
// requestBody/formData 欠落時に undefined を返すかを検証する。
describe("formData", () => {
  it("formDataがある場合、型付きで取り出せる", () => {
    const details = { requestBody: { formData: { api_id: ["1"] } } } as unknown as chrome.webRequest.OnBeforeRequestDetails;
    expect(formData<SampleFormData>(details)).toEqual({ api_id: ["1"] });
  });

  it("requestBodyが欠落している場合、undefinedを返す", () => {
    const details = { requestBody: undefined } as unknown as chrome.webRequest.OnBeforeRequestDetails;
    expect(formData<SampleFormData>(details)).toBeUndefined();
  });

  it("requestBodyはあるがformDataが欠落している場合、undefinedを返す", () => {
    const details = { requestBody: {} } as unknown as chrome.webRequest.OnBeforeRequestDetails;
    expect(formData<SampleFormData>(details)).toBeUndefined();
  });
});
