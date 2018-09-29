import { OnPort } from "../../../../../src/js/Applications/Background/Controllers/Request/Port";
import { dummyrequest } from "../../../../tools";

describe("Port Controllers", () => {
  describe("OnPort", () => {
    it("TODO: いろいろなんかする", async () => {
      const req = dummyrequest();
      const res = await OnPort(req);
      expect(res.status).toBe(200);
    });
  });
});
