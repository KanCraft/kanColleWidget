import {
  DebugController, DebugAvailables
} from "../../../../../src/js/Applications/Background/Controllers/Message/Debug";

describe("DebugController", () => {
  it("なんかする", async () => {
    const message = {
      __controller: "OnMissionStart",
      __this: {},
      requestBody: {
        formData: {
          api_mission_id: ["1"],
          api_deck_id: ["2"],
        },
      },
    };
    const res = await DebugController(message);
    expect(res.status).toBe(202);
    expect(res.mission.title).toBe("練習航海");
  });
});

describe("DebugAvailables", () => {
  it("デバッグコール可能なコントローラ名一覧を返す", () => {
    const res = DebugAvailables();
    expect(res.controllers.message.length).not.toBe(0);
    expect(res.controllers.request.length).not.toBe(0);
  });
});