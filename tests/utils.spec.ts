import {sleep} from "../src/js/utils";

describe("sleep", () => {
  it("与えられたミリ秒だけsetTimeoutするPromiseを返す", async () => {
    const start = Date.now();
    await sleep(200);
    const finish = Date.now();
    expect(start + 200 <= finish).toBe(true);
  });
});
