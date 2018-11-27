import {Screenshot} from "../../../../src/js/Applications/Background/Controllers/Alarms";

describe("Screenshot", () => {

  it("スクショを撮ってアレする", async () => {
    const res = await Screenshot({params: new URLSearchParams("?hoge=1212123456")});
    expect(res.status).toBe(202);
  });

});
