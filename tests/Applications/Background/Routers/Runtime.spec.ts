import { OnInstalledListener } from "../../../../src/js/Applications/Background/Routers/Runtime";

describe("RuntimeRouter", () => {
  it("RuntimeOnInstalledListenerは、reasonでroutingするんですね", async () => {
    const res = await OnInstalledListener({ reason: "install" });
    expect(res).toBe(true);
  });
});