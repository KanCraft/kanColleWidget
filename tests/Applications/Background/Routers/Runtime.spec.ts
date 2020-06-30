import { RuntimeOnInstalledListener } from "../../../../src/js/Applications/Background/Routers/Runtime";

describe("RuntimeRouter", () => {
  it("RuntimeOnInstalledListenerは、reasonでroutingするんですね", async () => {
    const res = await RuntimeOnInstalledListener({reason: "install"});
    expect(res).toBe(true);
  });
});