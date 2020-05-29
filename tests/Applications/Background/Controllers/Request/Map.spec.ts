import { OnMapStart } from "../../../../../src/js/Applications/Background/Controllers/Request/Map";
import { dummyrequest } from "../../../../tools";
describe("OnMapStart", () => {
  it("なんかする", () => {
    const req = dummyrequest({ requestBody: { formData: { "api_deck_id": [1], "api_maparea_id": [1], "api_mapinfo_no": [1] } } });
    OnMapStart(req);
  });
});
